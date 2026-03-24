import { supabase } from './supabase'
import type { Database } from '@/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row']

export class SupabaseRealtime {
  private static instance: SupabaseRealtime
  private subscriptions: Map<string, any> = new Map()

  static getInstance(): SupabaseRealtime {
    if (!SupabaseRealtime.instance) {
      SupabaseRealtime.instance = new SupabaseRealtime()
    }
    return SupabaseRealtime.instance
  }

  // Suscripción a mensajes de una conversación
  subscribeToMessages(
    conversationId: string,
    callback: (payload: any) => void
  ) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        callback
      )
      .subscribe()

    this.subscriptions.set(`messages:${conversationId}`, channel)
    return channel
  }

  // Suscripción a conversaciones de una sub-cuenta
  subscribeToConversations(
    subAccountId: string,
    callback: (payload: any) => void
  ) {
    const channel = supabase
      .channel(`conversations:${subAccountId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'conversations',
          filter: `sub_account_id=eq.${subAccountId}`,
        },
        callback
      )
      .subscribe()

    this.subscriptions.set(`conversations:${subAccountId}`, channel)
    return channel
  }

  // Suscripción a estado de sesiones WhatsApp
  subscribeToWhatsAppSessions(
    subAccountId: string,
    callback: (payload: any) => void
  ) {
    const channel = supabase
      .channel(`whatsapp_sessions:${subAccountId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'whatsapp_sessions',
          filter: `sub_account_id=eq.${subAccountId}`,
        },
        callback
      )
      .subscribe()

    this.subscriptions.set(`whatsapp_sessions:${subAccountId}`, channel)
    return channel
  }

  // Desuscribirse de un canal específico
  unsubscribe(channelId: string) {
    const channel = this.subscriptions.get(channelId)
    if (channel) {
      supabase.removeChannel(channel)
      this.subscriptions.delete(channelId)
    }
  }

  // Desuscribirse de todos los canales
  unsubscribeAll() {
    this.subscriptions.forEach((channel, channelId) => {
      supabase.removeChannel(channel)
    })
    this.subscriptions.clear()
  }

  // Marcar mensaje como leído
  async markMessageAsRead(messageId: string): Promise<void> {
    // Esta función se implementará cuando tengamos el campo read_at
    console.log('Marking message as read:', messageId)
  }

  // Obtener mensajes de una conversación
  async getMessages(conversationId: string, limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return data.reverse() // Mostrar mensajes más antiguos primero
  }

  // Obtener conversaciones de una sub-cuenta
  async getConversations(subAccountId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        contacts(*),
        whatsapp_sessions(*)
      `)
      .eq('sub_account_id', subAccountId)
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return []
    }

    return data || []
  }

  // Enviar mensaje
  async sendMessage(
    conversationId: string,
    content: string,
    messageType: Message['message_type'] = 'text',
    mediaUrl?: string
  ): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'user',
        message_type: messageType,
        content,
        media_url: mediaUrl,
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return null
    }

    return data
  }
}

export const realtimeClient = SupabaseRealtime.getInstance()