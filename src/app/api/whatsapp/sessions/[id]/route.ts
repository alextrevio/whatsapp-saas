import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { whatsappManager } from '@/lib/whatsapp'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id

    // Obtener datos de la sesión
    const { data: whatsappSession, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !whatsappSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Agregar información en tiempo real
    const sessionData = {
      ...whatsappSession,
      realTimeStatus: whatsappManager.getSessionStatus(sessionId),
      qrCode: whatsappManager.getSessionQR(sessionId)
    }

    return NextResponse.json({ session: sessionData })

  } catch (error) {
    console.error('Error fetching WhatsApp session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id

    // Destruir sesión de WhatsApp
    await whatsappManager.destroySession(sessionId)

    // Eliminar de base de datos
    const { error } = await supabase
      .from('whatsapp_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Sesión eliminada exitosamente' 
    })

  } catch (error) {
    console.error('Error deleting WhatsApp session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}