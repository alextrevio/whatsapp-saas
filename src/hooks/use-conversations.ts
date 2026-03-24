'use client'

import { useState, useEffect, useCallback } from 'react'
import { realtimeClient } from '@/lib/supabase-realtime'
import type { Database } from '@/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  contacts?: Database['public']['Tables']['contacts']['Row']
  whatsapp_sessions?: Database['public']['Tables']['whatsapp_sessions']['Row']
}

interface UseConversationsProps {
  // No longer need subAccountId for single tenant
}

export function useConversations({}: UseConversationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar conversaciones iniciales
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await realtimeClient.getConversations('default')
      setConversations(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar conversaciones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar mensajes de una conversación
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const data = await realtimeClient.getMessages(conversationId)
      setMessages(data)
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }, [])

  // Seleccionar conversación
  const selectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation)
    loadMessages(conversation.id)
  }, [loadMessages])

  // Enviar mensaje
  const sendMessage = useCallback(async (
    content: string,
    messageType: Message['message_type'] = 'text',
    mediaUrl?: string
  ) => {
    if (!selectedConversation) return null

    try {
      const message = await realtimeClient.sendMessage(
        selectedConversation.id,
        content,
        messageType,
        mediaUrl
      )
      
      if (message) {
        setMessages(prev => [...prev, message])
        
        // Actualizar última actividad de la conversación
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, last_message_at: message.created_at }
            : conv
        ))
      }

      return message
    } catch (err) {
      console.error('Error sending message:', err)
      return null
    }
  }, [selectedConversation])

  // Configurar suscripciones en tiempo real
  useEffect(() => {
    const subAccountId = 'default' // TODO: get from auth context
    if (!subAccountId) return

    // Suscripción a conversaciones
    const conversationsChannel = realtimeClient.subscribeToConversations(
      subAccountId,
      (payload) => {
        console.log('Conversation update:', payload)
        
        if (payload.eventType === 'INSERT') {
          setConversations(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setConversations(prev => prev.map(conv => 
            conv.id === payload.new.id ? { ...conv, ...payload.new } : conv
          ))
        } else if (payload.eventType === 'DELETE') {
          setConversations(prev => prev.filter(conv => conv.id !== payload.old.id))
        }
      }
    )

    return () => {
      realtimeClient.unsubscribe(`conversations:${subAccountId}`)
    }
  }, [])

  // Suscripción a mensajes de conversación seleccionada
  useEffect(() => {
    if (!selectedConversation) return

    const messagesChannel = realtimeClient.subscribeToMessages(
      selectedConversation.id,
      (payload) => {
        console.log('New message:', payload)
        
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new])
          
          // Actualizar conversación con último mensaje
          setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, last_message_at: payload.new.created_at }
              : conv
          ))
        }
      }
    )

    return () => {
      realtimeClient.unsubscribe(`messages:${selectedConversation.id}`)
    }
  }, [selectedConversation])

  // Cargar datos iniciales
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    selectConversation,
    sendMessage,
    loadConversations,
    loadMessages,
  }
}