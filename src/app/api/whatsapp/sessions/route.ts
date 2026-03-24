import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { whatsappManager } from '@/lib/whatsapp'
import { createWhatsAppSessionSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener sesiones del usuario
    const { data: sessions, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Agregar estado en tiempo real
    const sessionsWithStatus = sessions?.map(session => ({
      ...(session as any),
      realTimeStatus: whatsappManager.getSessionStatus((session as any).id)
    })) || []

    return NextResponse.json({ sessions: sessionsWithStatus })

  } catch (error) {
    console.error('Error fetching WhatsApp sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const validatedData = createWhatsAppSessionSchema.parse(body)

    // Crear sesión en base de datos
    const { data: whatsappSession, error } = await (supabase as any)
      .from('whatsapp_sessions')
      .insert({
        user_id: session.user.id, // Usuario actual
        session_name: validatedData.sessionName,
        status: 'connecting',
        proxy_config: validatedData.proxyConfig || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Inicializar sesión de WhatsApp
    try {
      await whatsappManager.createSession(whatsappSession.id, session.user.id)
    } catch (whatsappError) {
      // Si falla la creación, eliminar de BD
      await supabase
        .from('whatsapp_sessions')
        .delete()
        .eq('id', whatsappSession.id)
      
      throw whatsappError
    }

    return NextResponse.json({ 
      session: whatsappSession,
      message: 'Sesión creada exitosamente'
    })

  } catch (error: any) {
    console.error('Error creating WhatsApp session:', error)
    
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