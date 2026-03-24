import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { supabaseAdmin } from './supabase-admin'
import { WhatsAppBotEngine, DEFAULT_PERSONALITIES } from './openai'
import { automationEngine } from './automation-engine'
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
  private botEngines: Map<string, WhatsAppBotEngine> = new Map()
  private botSettings: Map<string, { enabled: boolean, personalityId: string, autoReply: boolean }> = new Map()

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

  async createSession(sessionId: string, userId: string): Promise<void> {
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
        await this.handleIncomingMessage(sessionId, 'default', message)
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
    userId: string, 
    message: any
  ): Promise<void> {
    try {
      const contact = await message.getContact()
      const phoneNumber = `+${contact.number}`
      
      // Buscar o crear contacto
      let { data: contactData } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single()

      if (!contactData) {
        const { data: newContact } = await (supabaseAdmin as any)
          .from('contacts')
          .insert({
            phone_number: phoneNumber,
            name: contact.pushname || contact.name || 'Sin nombre',
            tags: ['nuevo'],
            custom_fields: {},
            lead_score: 0
          })
          .select('*')
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
        .select('*')
        .eq('contact_id', (contactData as any).id)
        .single()

      if (!conversation) {
        const { data: newConversation } = await (supabaseAdmin as any)
          .from('conversations')
          .insert({
            contact_id: (contactData as any).id,
            whatsapp_session_id: sessionId,
            status: 'open'
          })
          .select('*')
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
        messageType = message.type
        mediaUrl = `data:${media.mimetype};base64,${media.data}`
        content = message.body || `[${messageType.toUpperCase()}]`
      }

      // Guardar mensaje del contacto
      await (supabaseAdmin as any)
        .from('messages')
        .insert({
          conversation_id: (conversation as any).id,
          sender_type: 'contact',
          message_type: messageType,
          content,
          media_url: mediaUrl,
          whatsapp_message_id: message.id._serialized
        })

      // 🤖 PROCESAMIENTO INTELIGENTE
      await this.processIntelligentResponse(
        sessionId,
        (contactData as any).id,
        (conversation as any).id,
        content,
        contactData as any,
        phoneNumber
      )

      // ⚡ TRIGGERS DE AUTOMATIZACIÓN
      await automationEngine.processIncomingMessage(
        (contactData as any).id,
        content,
        (conversation as any).id,
        sessionId
      )

      // Actualizar última actividad
      await (supabaseAdmin as any)
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          status: 'open'
        })
        .eq('id', (conversation as any).id)

      console.log('✅ Message processed with AI:', {
        from: phoneNumber,
        content: content.substring(0, 50) + '...'
      })

    } catch (error) {
      console.error('Error handling incoming message:', error)
    }
  }

  // 🤖 PROCESAMIENTO INTELIGENTE DE RESPUESTAS
  private async processIntelligentResponse(
    sessionId: string,
    contactId: string,
    conversationId: string,
    message: string,
    contact: any,
    phoneNumber: string
  ): Promise<void> {
    try {
      // Verificar si el bot está habilitado para esta sesión
      const botSettings = this.botSettings.get(sessionId)
      if (!botSettings?.enabled) {
        console.log('Bot disabled for session:', sessionId)
        return
      }

      // Obtener o crear bot engine
      let botEngine = this.botEngines.get(sessionId)
      if (!botEngine) {
        const personality = DEFAULT_PERSONALITIES.find(p => p.id === botSettings.personalityId) || DEFAULT_PERSONALITIES[0]
        botEngine = new WhatsAppBotEngine(personality)
        this.botEngines.set(sessionId, botEngine)
      }

      // Verificar si el usuario quiere hablar con humano
      if (botEngine.detectHumanHandoff(message)) {
        await this.transferToHuman(conversationId, contactId)
        return
      }

      // Construir contexto de conversación
      const conversationHistory = await this.getConversationHistory(conversationId)
      const context = {
        contactName: contact.name,
        contactPhone: phoneNumber,
        conversationHistory,
        tags: contact.tags || [],
        lastActivity: new Date().toISOString(),
        leadScore: contact.lead_score || 0
      }

      // Generar respuesta inteligente
      const response = await botEngine.generateResponse(message, context)
      
      if (response && response.trim()) {
        // Enviar respuesta automática
        await this.sendMessage(sessionId, phoneNumber, response)
        
        // Guardar respuesta del bot
        await (supabaseAdmin as any)
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_type: 'bot',
            message_type: 'text',
            content: response,
            metadata: { 
              automated: true,
              personality: botSettings.personalityId,
              intent: botEngine.detectIntent(message)
            }
          })

        // Actualizar lead score basado en intent
        const intent = botEngine.detectIntent(message)
        let scoreChange = 0
        
        switch (intent) {
          case 'interest': scoreChange = 10; break
          case 'question': scoreChange = 5; break
          case 'greeting': scoreChange = 2; break
          case 'complaint': scoreChange = -5; break
        }

        if (scoreChange !== 0) {
          const newScore = Math.max(0, Math.min(100, (contact.lead_score || 0) + scoreChange))
          await (supabaseAdmin as any)
            .from('contacts')
            .update({ lead_score: newScore })
            .eq('id', contactId)
        }

        console.log(`🤖 Bot responded: "${response.substring(0, 50)}..." | Intent: ${intent} | Score: +${scoreChange}`)
      }

    } catch (error) {
      console.error('Error in intelligent processing:', error)
    }
  }

  private async getConversationHistory(conversationId: string) {
    const { data } = await supabaseAdmin
      .from('messages')
      .select('sender_type, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(20)

    return (data || []).reverse().map((msg: any) => ({
      role: (msg.sender_type === 'contact' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: String(msg.content || ''),
      timestamp: String(msg.created_at || '')
    }))
  }

  private async transferToHuman(conversationId: string, contactId: string): Promise<void> {
    // Marcar conversación para atención humana
    await (supabaseAdmin as any)
      .from('conversations')
      .update({ 
        status: 'needs_human',
        human_handoff_requested: true
      })
      .eq('id', conversationId)

    // Agregar tag de seguimiento
    const { data: contact } = await supabaseAdmin
      .from('contacts')
      .select('tags')
      .eq('id', contactId)
      .single()

    if (contact) {
      const tags = [...(contact as any).tags, 'needs_human']
      await (supabaseAdmin as any)
        .from('contacts')
        .update({ tags })
        .eq('id', contactId)
    }

    console.log(`👨‍💼 Human handoff requested for contact: ${contactId}`)
  }

  // API PÚBLICA PARA CONFIGURAR BOTS
  enableBot(sessionId: string, personalityId: string = 'friendly', autoReply: boolean = true): void {
    this.botSettings.set(sessionId, {
      enabled: true,
      personalityId,
      autoReply
    })
    console.log(`🤖 Bot enabled for session ${sessionId} with personality: ${personalityId}`)
  }

  disableBot(sessionId: string): void {
    this.botSettings.set(sessionId, {
      enabled: false,
      personalityId: 'friendly',
      autoReply: false
    })
    this.botEngines.delete(sessionId)
    console.log(`🤖 Bot disabled for session ${sessionId}`)
  }

  getBotStatus(sessionId: string): { enabled: boolean, personality: string } {
    const settings = this.botSettings.get(sessionId)
    return {
      enabled: settings?.enabled || false,
      personality: settings?.personalityId || 'none'
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

      await (supabaseAdmin as any)
        .from('whatsapp_sessions')
        .update(updateData)
        .eq('id', sessionId)

    } catch (error) {
      console.error('Error updating session status:', error)
    }
  }

  private async updateSessionQR(sessionId: string, qrCode: string): Promise<void> {
    try {
      await (supabaseAdmin as any)
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

// Hacer disponible globalmente para las automatizaciones
if (typeof global !== 'undefined') {
  ;(global as any).whatsappManager = whatsappManager
}