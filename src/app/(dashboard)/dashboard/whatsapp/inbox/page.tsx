'use client'

import { useState } from 'react'
import { useConversations } from '@/hooks/use-conversations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { 
  Send, 
  Search, 
  Filter, 
  MessageCircle, 
  Clock, 
  User,
  Phone,
  Paperclip,
  Smile
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Database } from '@/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  contacts?: Database['public']['Tables']['contacts']['Row']
  whatsapp_sessions?: Database['public']['Tables']['whatsapp_sessions']['Row']
}

export default function InboxPage() {
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    selectConversation,
    sendMessage,
  } = useConversations({})

  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sending, setSending] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      await sendMessage(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const contactName = conv.contacts?.name || ''
    const phoneNumber = conv.contacts?.phone_number || ''
    return (
      contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneNumber.includes(searchQuery)
    )
  })

  const getMessagePreview = (conversation: Conversation) => {
    // En una implementación real, obtendrías el último mensaje
    return 'Último mensaje de ejemplo...'
  }

  const getContactName = (conversation: Conversation) => {
    return conversation.contacts?.name || 
           conversation.contacts?.phone_number || 
           'Contacto desconocido'
  }

  const getMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Lista de Conversaciones */}
      <Card className="w-1/3 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Conversaciones
            </CardTitle>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay conversaciones</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 ${
                    selectedConversation?.id === conversation.id 
                      ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500' 
                      : ''
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 bg-green-100 dark:bg-green-900">
                      <div className="flex items-center justify-center h-full w-full">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {getContactName(conversation)}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.last_message_at && getMessageTime(conversation.last_message_at)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {getMessagePreview(conversation)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant={conversation.status === 'open' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {conversation.status === 'open' ? 'Abierta' : 'Cerrada'}
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {conversation.whatsapp_sessions?.phone_number || 'Sin sesión'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header del Chat */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 bg-green-100 dark:bg-green-900">
                  <div className="flex items-center justify-center h-full w-full">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {getContactName(selectedConversation)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.contacts?.phone_number}
                  </p>
                </div>
                
                <Badge
                  variant={selectedConversation.status === 'open' ? 'default' : 'secondary'}
                >
                  {selectedConversation.status === 'open' ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </CardHeader>

            {/* Mensajes */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_type === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender_type === 'user'
                            ? 'text-green-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Input de Mensaje */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button type="button" variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Input
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  disabled={sending}
                />
                
                <Button type="button" variant="outline" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-500">
                Elige una conversación de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}