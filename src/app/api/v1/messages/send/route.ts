import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { whatsappManager } from '@/lib/whatsapp'
import { 
  validateApiKeyMiddleware, 
  hasPermission, 
  checkRateLimit 
} from '@/lib/api-keys'
import { z } from 'zod'

const sendMessageSchema = z.object({
  to: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  message: z.string().min(1, 'Message cannot be empty').max(4096, 'Message too long'),
  type: z.enum(['text', 'image', 'document', 'audio']).default('text'),
  mediaUrl: z.string().url().optional(),
  sessionId: z.string().uuid().optional() // Si no se especifica, usar la primera sesión activa
})

export async function POST(request: NextRequest) {
  try {
    // Validar API key
    const auth = await validateApiKeyMiddleware(request)
    if (!auth.isValid || !auth.apiKey) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verificar permisos
    if (!hasPermission(auth.apiKey, 'messages:send')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Rate limiting más estricto para envío de mensajes
    const rateLimit = checkRateLimit(auth.apiKey.id, 50, 60) // 50 messages/hour
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      )
    }

    // Validar body
    const body = await request.json()
    const validatedData = sendMessageSchema.parse(body)

    // Obtener sesión WhatsApp
    let sessionId = validatedData.sessionId
    if (!sessionId) {
      // Buscar primera sesión activa
      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_sessions')
        .select('id')
        .eq('sub_account_id', auth.organization.id)
        .eq('status', 'connected')
        .limit(1)
        .single()

      if (!sessions) {
        return NextResponse.json(
          { error: 'No active WhatsApp session found' },
          { status: 400 }
        )
      }
      sessionId = sessions.id
    }

    // Verificar que la sesión pertenece a la organización
    const { data: session } = await supabaseAdmin
      .from('whatsapp_sessions')
      .select('id, status, sub_account_id')
      .eq('id', sessionId)
      .eq('sub_account_id', auth.organization.id)
      .single()

    if (!session) {
      return NextResponse.json(
        { error: 'WhatsApp session not found' },
        { status: 404 }
      )
    }

    if (session.status !== 'connected') {
      return NextResponse.json(
        { error: 'WhatsApp session is not connected' },
        { status: 400 }
      )
    }

    // Buscar o crear contacto
    let { data: contact } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('sub_account_id', auth.organization.id)
      .eq('phone_number', validatedData.to)
      .single()

    if (!contact) {
      const { data: newContact } = await supabaseAdmin
        .from('contacts')
        .insert({
          sub_account_id: auth.organization.id,
          phone_number: validatedData.to,
          tags: ['api'],
          custom_fields: {}
        })
        .select('id')
        .single()

      contact = newContact
    }

    if (!contact) {
      return NextResponse.json(
        { error: 'Failed to create/find contact' },
        { status: 500 }
      )
    }

    // Buscar o crear conversación
    let { data: conversation } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('sub_account_id', auth.organization.id)
      .eq('contact_id', contact.id)
      .single()

    if (!conversation) {
      const { data: newConversation } = await supabaseAdmin
        .from('conversations')
        .insert({
          sub_account_id: auth.organization.id,
          contact_id: contact.id,
          whatsapp_session_id: sessionId,
          status: 'open'
        })
        .select('id')
        .single()

      conversation = newConversation
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create/find conversation' },
        { status: 500 }
      )
    }

    // Enviar mensaje via WhatsApp
    const success = await whatsappManager.sendMessage(
      sessionId,
      validatedData.to,
      validatedData.message,
      validatedData.mediaUrl
    )

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message' },
        { status: 500 }
      )
    }

    // Guardar mensaje en base de datos
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'user',
        message_type: validatedData.type,
        content: validatedData.message,
        media_url: validatedData.mediaUrl,
        metadata: {
          api_key_id: auth.apiKey.id,
          sent_via: 'api'
        }
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error saving message:', messageError)
      // No fallar la request si el mensaje se envió exitosamente
    }

    // Actualizar conversación
    await supabaseAdmin
      .from('conversations')
      .update({ 
        last_message_at: new Date().toISOString(),
        status: 'open'
      })
      .eq('id', conversation.id)

    return NextResponse.json({
      data: {
        messageId: message?.id,
        to: validatedData.to,
        message: validatedData.message,
        type: validatedData.type,
        status: 'sent',
        timestamp: new Date().toISOString()
      },
      message: 'Message sent successfully'
    }, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
      }
    })

  } catch (error: any) {
    console.error('API v1 messages send error:', error)
    
    if (error.errors) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}