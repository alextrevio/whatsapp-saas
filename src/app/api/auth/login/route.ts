import { NextRequest, NextResponse } from 'next/server'
import { supabaseAuth } from '@/lib/supabase-admin'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Login: Starting login...')
    
    const body = await request.json()
    console.log('📋 Request body:', { email: body.email })

    // Validar datos
    const validatedData = loginSchema.parse(body)
    console.log('✅ Validation passed')

    // Intentar login en Supabase
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    console.log('📊 Supabase response:', { 
      user: data.user?.id, 
      session: !!data.session,
      error: error?.message 
    })

    if (error) {
      console.error('❌ Supabase auth error:', error)
      
      // Manejo específico de errores
      let errorMessage = 'Email o contraseña incorrectos'
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Email no confirmado. Revisa tu bandeja de entrada.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Espera unos minutos.'
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          details: error.message,
          code: error.status
        },
        { status: 400 }
      )
    }

    // Verificar que tenemos usuario y sesión
    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'No se pudo iniciar sesión correctamente' },
        { status: 500 }
      )
    }

    console.log('✅ Login successful for user:', data.user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      message: 'Inicio de sesión exitoso'
    })

  } catch (error: any) {
    console.error('❌ API Login error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message
      },
      { status: 500 }
    )
  }
}