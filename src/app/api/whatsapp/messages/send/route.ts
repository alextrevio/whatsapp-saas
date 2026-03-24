import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { whatsappManager } from '@/lib/whatsapp'
import { sendMessageSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validar datos de entrada
    const body = await request.json()
    const validatedData = sendMessageSchema.parse(body)

    // Obtener conversación
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        contacts(*),
        whatsapp_sessions(*)
      `)
      .eq('id', validatedData.conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (!conversation.whatsapp_sessions || !conversation.contacts) {
      return NextResponse.json(
        { error: 'Invalid conversation data' },
        { status: 400 }
      )
    }

    // Enviar mensaje via WhatsApp
    const success = await whatsappManager.sendMessage(
      conversation.whatsapp_sessions.id,
      conversation.contacts.phone_number,
      validatedData.content,
      validatedData.mediaUrl
    )

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message' },
        { status: 500 }
      )
    }

    // Guardar mensaje en base de datos
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: validatedData.conversationId,
        sender_type: 'user',
        message_type: validatedData.messageType,
        content: validatedData.content,
        media_url: validatedData.mediaUrl,
        metadata: validatedData.metadata
      })
      .select()
      .single()

    if (msgError) {
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Actualizar conversación
    await supabase
      .from('conversations')
      .update({ 
        last_message_at: new Date().toISOString(),
        status: 'open'
      })
      .eq('id', validatedData.conversationId)

    return NextResponse.json({ 
      message,
      success: true 
    })

  } catch (error: any) {
    console.error('Error sending message:', error)
    
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