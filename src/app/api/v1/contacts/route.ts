import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { 
  validateApiKeyMiddleware, 
  hasPermission, 
  checkRateLimit 
} from '@/lib/api-keys'
import { createContactSchema } from '@/lib/validations'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val) || 20, 100) : 20),
  search: z.string().optional(),
  tags: z.string().optional().transform(val => val ? val.split(',') : undefined),
})

export async function GET(request: NextRequest) {
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
    if (!hasPermission(auth.apiKey, 'contacts:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Rate limiting
    const rateLimit = checkRateLimit(auth.apiKey.id, 1000, 60) // 1000 req/hour
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

    // Parsear query parameters
    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams)
    const { page, limit, search, tags } = querySchema.parse(queryParams)

    // Construir query
    let query = supabaseAdmin
      .from('contacts')
      .select('id, phone_number, name, tags, custom_fields, last_interaction, created_at')
      .eq('sub_account_id', auth.organization.id) // Filtrar por organización

    // Aplicar filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%,phone_number.ilike.%${search}%`)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    // Paginación
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data: contacts, error, count } = await query

    if (error) {
      throw error
    }

    // Calcular metadata de paginación
    const totalContacts = count || 0
    const totalPages = Math.ceil(totalContacts / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: contacts || [],
      meta: {
        page,
        limit,
        total: totalContacts,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    }, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
      }
    })

  } catch (error: any) {
    console.error('API v1 contacts GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    if (!hasPermission(auth.apiKey, 'contacts:write')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Rate limiting
    const rateLimit = checkRateLimit(auth.apiKey.id, 100, 60) // 100 creates/hour
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
    const validatedData = createContactSchema.parse(body)

    // Verificar si el contacto ya existe
    const { data: existingContact } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('sub_account_id', auth.organization.id)
      .eq('phone_number', validatedData.phoneNumber)
      .single()

    if (existingContact) {
      return NextResponse.json(
        { error: 'Contact with this phone number already exists' },
        { status: 409 }
      )
    }

    // Crear contacto
    const { data: contact, error } = await supabaseAdmin
      .from('contacts')
      .insert({
        sub_account_id: auth.organization.id,
        phone_number: validatedData.phoneNumber,
        name: validatedData.name,
        tags: validatedData.tags,
        custom_fields: validatedData.customFields
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      data: contact,
      message: 'Contact created successfully'
    }, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
      }
    })

  } catch (error: any) {
    console.error('API v1 contacts POST error:', error)
    
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