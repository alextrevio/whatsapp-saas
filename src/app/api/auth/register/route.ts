import { NextRequest, NextResponse } from 'next/server'
import { supabaseAuth, supabaseAdmin } from '@/lib/supabase-admin'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  organizationName: z.string().min(2, 'El nombre de la organización debe tener al menos 2 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Register: Starting registration...')
    
    const body = await request.json()
    console.log('📋 Request body:', { email: body.email, organizationName: body.organizationName })

    // Validar datos
    const validatedData = registerSchema.parse(body)
    console.log('✅ Validation passed')

    // Registrar usuario en Supabase
    const { data, error } = await supabaseAuth.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          organization_name: validatedData.organizationName,
        },
      },
    })

    console.log('📊 Supabase response:', { 
      user: data.user?.id, 
      session: !!data.session,
      error: error?.message 
    })

    if (error) {
      console.error('❌ Supabase auth error:', error)
      
      // Manejo específico de errores
      let errorMessage = 'Error al crear cuenta'
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido'
      } else if (error.message.includes('Password')) {
        errorMessage = 'Contraseña inválida'
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

    // Verificar que el usuario se creó
    if (!data.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
        { status: 500 }
      )
    }

    console.log('✅ User created successfully:', data.user.id)

    // Si no hay sesión, significa que necesita confirmación de email
    if (!data.session) {
      console.log('📧 Email confirmation required')
      
      return NextResponse.json({
        success: true,
        user: data.user,
        message: 'Cuenta creada exitosamente. Si tienes problemas para iniciar sesión, verifica que la confirmación de email esté desactivada en Supabase.',
        needsConfirmation: true
      })
    }

    // Si hay sesión, el registro fue completamente exitoso
    console.log('🎉 Registration completed with session')
    
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      message: 'Cuenta creada e inicio de sesión exitoso'
    })

  } catch (error: any) {
    console.error('❌ API Register error:', error)

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