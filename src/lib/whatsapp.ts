import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { supabaseAdmin } from './supabase'
import fs from 'fs/promises'
import path from 'path'

interface WhatsAppSession {
  id: string
  client: Client | null
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  qrCode?: string
  phoneNumber?: string
}

export class WhatsAppManager {
  private static instance: WhatsAppManager
  private sessions: Map<string, WhatsAppSession> = new Map()
  private readonly SESSION_DIR = './whatsapp-sessions'

  static getInstance(): WhatsAppManager {
    if (!WhatsAppManager.instance) {
      WhatsAppManager.instance = new WhatsAppManager()
    }
    return WhatsAppManager.instance
  }

  constructor() {
    this.ensureSessionDirectory()
  }

  private async ensureSessionDirectory() {
    try {
      await fs.mkdir(this.SESSION_DIR, { recursive: true })
    } catch (error) {
      console.error('Error creating session directory:', error)
    }
  }

  async createSession(sessionId: string, subAccountId: string): Promise<void> {
    if (this.sessions.has(sessionId)) {
      throw new Error('Session already exists')
    }

    // Inicializar sesión
    const session: WhatsAppSession = {
      id: sessionId,
      client: null,
      status: 'connecting'
    }

    this.sessions.set(sessionId, session)

    try {
      // Actualizar estado en base de datos
      await this.updateSessionStatus(sessionId, 'connecting')

      // Crear cliente WhatsApp
      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: sessionId,
          dataPath: this.SESSION_DIR
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      })

      session.client = client

      // Event handlers
      client.on('qr', async (qr) => {
        console.log('QR Code received for session:', sessionId)
        
        // Generar QR en terminal (desarrollo)
        qrcode.generate(qr, { small: true })
        
        // Guardar QR en base de datos
        await this.updateSessionQR(sessionId, qr)
        session.qrCode = qr
      })

      client.on('ready', async () => {
        console.log('WhatsApp client ready for session:', sessionId)
        
        const clientInfo = client.info
        session.status = 'connected'
        session.phoneNumber = clientInfo?.wid?.user

        await this.updateSessionStatus(
          sessionId, 
          'connected', 
          session.phoneNumber
        )
      })

      client.on('authenticated', async () => {
        console.log('WhatsApp client authenticated for session:', sessionId)
        session.status = 'connected'
        await this.updateSessionStatus(sessionId, 'connected')
      })

      client.on('auth_failure', async (msg) => {
        console.error('Authentication failed for session:', sessionId, msg)
        session.status = 'error'
        await this.updateSessionStatus(sessionId, 'error')
      })

      client.on('disconnected', async (reason) => {
        console.log('WhatsApp client disconnected for session:', sessionId, reason)
        session.status = 'disconnected'
        await this.updateSessionStatus(sessionId, 'disconnected')
        this.sessions.delete(sessionId)
      })

      client.on('message', async (message) => {
        await this.handleIncomingMessage(sessionId, subAccountId, message)
      })

      // Inicializar cliente
      await client.initialize()

    } catch (error) {
      console.error('Error creating WhatsApp session:', error)
      session.status = 'error'
      await this.updateSessionStatus(sessionId, 'error')
      throw error
    }
  }

  async sendMessage(
    sessionId: string, 
    phoneNumber: string, 
    message: string,
    mediaPath?: string
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    
    if (!session || !session.client || session.status !== 'connected') {
      throw new Error('Session not connected')
    }

    try {
      const chatId = `${phoneNumber}@c.us`
      
      if (mediaPath) {
        const media = MessageMedia.fromFilePath(mediaPath)
        await session.client.sendMessage(chatId, media, { caption: message })
      } else {
        await session.client.sendMessage(chatId, message)
      }

      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }

  async sendBulkMessages(
    sessionId: string,
    contacts: Array<{ phone: string; message: string; mediaPath?: string }>,
    delayMs: number = 3000
  ): Promise<{ success: number; failed: number }> {
    const results = { success: 0, failed: 0 }
    
    for (const contact of contacts) {
      try {
        const success = await this.sendMessage(
          sessionId, 
          contact.phone, 
          contact.message,
          contact.mediaPath
        )
        
        if (success) {
          results.success++
        } else {
          results.failed++
        }
        
        // Delay entre mensajes
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        
      } catch (error) {
        console.error(`Failed to send to ${contact.phone}:`, error)
        results.failed++
      }
    }
    
    return results
  }

  getSessionStatus(sessionId: string): string {
    const session = this.sessions.get(sessionId)
    return session?.status || 'disconnected'
  }

  getSessionQR(sessionId: string): string | undefined {
    const session = this.sessions.get(sessionId)
    return session?.qrCode
  }

  async destroySession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    
    if (session?.client) {
      try {
        await session.client.destroy()
      } catch (error) {
        console.error('Error destroying client:', error)
      }
    }
    
    this.sessions.delete(sessionId)
    await this.updateSessionStatus(sessionId, 'disconnected')
  }

  private async handleIncomingMessage(
    sessionId: string,
    subAccountId: string, 
    message: any
  ): Promise<void> {
    try {
      const contact = await message.getContact()
      const phoneNumber = `+${contact.number}`
      
      // Buscar o crear contacto
      let { data: contactData } = await supabaseAdmin
        .from('contacts')
        .select('id')
        .eq('sub_account_id', subAccountId)
        .eq('phone_number', phoneNumber)
        .single()

      if (!contactData) {
        const { data: newContact } = await supabaseAdmin
          .from('contacts')
          .insert({
            sub_account_id: subAccountId,
            phone_number: phoneNumber,
            name: contact.pushname || contact.name,
            tags: [],
            custom_fields: {}
          })
          .select('id')
          .single()

        contactData = newContact
      }

      if (!contactData) {
        console.error('Failed to create/find contact')
        return
      }

      // Buscar o crear conversación
      let { data: conversation } = await supabaseAdmin
        .from('conversations')
        .select('id')
        .eq('sub_account_id', subAccountId)
        .eq('contact_id', contactData.id)
        .single()

      if (!conversation) {
        const { data: newConversation } = await supabaseAdmin
          .from('conversations')
          .insert({
            sub_account_id: subAccountId,
            contact_id: contactData.id,
            whatsapp_session_id: sessionId,
            status: 'open'
          })
          .select('id')
          .single()

        conversation = newConversation
      }

      if (!conversation) {
        console.error('Failed to create/find conversation')
        return
      }

      // Determinar tipo de mensaje
      let messageType = 'text'
      let content = message.body
      let mediaUrl = null

      if (message.hasMedia) {
        const media = await message.downloadMedia()
        // En producción, subirías el media a storage y guardarías la URL
        messageType = message.type
        mediaUrl = `data:${media.mimetype};base64,${media.data}`
        content = message.body || `[${messageType.toUpperCase()}]`
      }

      // Guardar mensaje
      await supabaseAdmin
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_type: 'contact',
          message_type: messageType,
          content,
          media_url: mediaUrl,
          whatsapp_message_id: message.id._serialized
        })

      // Actualizar última actividad de conversación
      await supabaseAdmin
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          status: 'open'
        })
        .eq('id', conversation.id)

      console.log('Message saved:', {
        from: phoneNumber,
        type: messageType,
        content: content.substring(0, 50) + '...'
      })

    } catch (error) {
      console.error('Error handling incoming message:', error)
    }
  }

  private async updateSessionStatus(
    sessionId: string, 
    status: string, 
    phoneNumber?: string
  ): Promise<void> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      }
      
      if (phoneNumber) {
        updateData.phone_number = phoneNumber
      }

      await supabaseAdmin
        .from('whatsapp_sessions')
        .update(updateData)
        .eq('id', sessionId)

    } catch (error) {
      console.error('Error updating session status:', error)
    }
  }

  private async updateSessionQR(sessionId: string, qrCode: string): Promise<void> {
    try {
      await supabaseAdmin
        .from('whatsapp_sessions')
        .update({ 
          qr_code: qrCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

    } catch (error) {
      console.error('Error updating session QR:', error)
    }
  }
}

export const whatsappManager = WhatsAppManager.getInstance()