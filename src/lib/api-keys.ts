import crypto from 'crypto'
import { supabaseAdmin } from './supabase'

export interface ApiKey {
  id: string
  organization_id: string
  name: string
  key: string
  prefix: string
  permissions: string[]
  last_used_at?: string
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export const API_PERMISSIONS = {
  'contacts:read': 'Leer contactos',
  'contacts:write': 'Crear y editar contactos',
  'contacts:delete': 'Eliminar contactos',
  'messages:read': 'Leer mensajes',
  'messages:send': 'Enviar mensajes',
  'conversations:read': 'Leer conversaciones',
  'conversations:write': 'Gestionar conversaciones',
  'campaigns:read': 'Leer campañas',
  'campaigns:write': 'Crear y gestionar campañas',
  'sessions:read': 'Ver sesiones WhatsApp',
  'sessions:write': 'Gestionar sesiones WhatsApp',
  'webhooks:manage': 'Configurar webhooks'
} as const

export type ApiPermission = keyof typeof API_PERMISSIONS

// Generar nueva API key
export function generateApiKey(): { key: string; prefix: string } {
  const prefix = 'wsp' // WhatsApp SaaS Platform
  const randomBytes = crypto.randomBytes(32)
  const key = `${prefix}_${randomBytes.toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 48)}`
  
  return { key, prefix }
}

// Hash de API key para almacenamiento seguro
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

// Crear nueva API key
export async function createApiKey(
  organizationId: string,
  name: string,
  permissions: ApiPermission[],
  expiresInDays?: number
): Promise<{ apiKey: ApiKey; plainKey: string }> {
  const { key: plainKey, prefix } = generateApiKey()
  const hashedKey = hashApiKey(plainKey)

  let expiresAt = null
  if (expiresInDays) {
    expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)
  }

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .insert({
      organization_id: organizationId,
      name,
      key: hashedKey,
      prefix,
      permissions,
      expires_at: expiresAt?.toISOString(),
      is_active: true
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating API key: ${error.message}`)
  }

  return {
    apiKey: data,
    plainKey // Solo se devuelve una vez
  }
}

// Validar API key
export async function validateApiKey(key: string): Promise<{
  isValid: boolean
  apiKey?: ApiKey
  organization?: any
}> {
  try {
    const hashedKey = hashApiKey(key)

    const { data: apiKeyData, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        *,
        organizations(*)
      `)
      .eq('key', hashedKey)
      .eq('is_active', true)
      .single()

    if (error || !apiKeyData) {
      return { isValid: false }
    }

    // Verificar expiración
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return { isValid: false }
    }

    // Actualizar last_used_at
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyData.id)

    return {
      isValid: true,
      apiKey: apiKeyData,
      organization: apiKeyData.organizations
    }
  } catch (error) {
    console.error('Error validating API key:', error)
    return { isValid: false }
  }
}

// Verificar permisos
export function hasPermission(apiKey: ApiKey, permission: ApiPermission): boolean {
  return apiKey.permissions.includes(permission)
}

// Listar API keys de una organización
export async function listApiKeys(organizationId: string): Promise<ApiKey[]> {
  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error listing API keys: ${error.message}`)
  }

  return data || []
}

// Desactivar API key
export async function revokeApiKey(apiKeyId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('api_keys')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', apiKeyId)

  if (error) {
    throw new Error(`Error revoking API key: ${error.message}`)
  }
}

// Actualizar permisos de API key
export async function updateApiKeyPermissions(
  apiKeyId: string,
  permissions: ApiPermission[]
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('api_keys')
    .update({ 
      permissions,
      updated_at: new Date().toISOString() 
    })
    .eq('id', apiKeyId)

  if (error) {
    throw new Error(`Error updating API key permissions: ${error.message}`)
  }
}

// Middleware para validar API key en requests
export async function validateApiKeyMiddleware(request: Request): Promise<{
  isValid: boolean
  apiKey?: ApiKey
  organization?: any
  error?: string
}> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader) {
    return { isValid: false, error: 'Authorization header required' }
  }

  const match = authHeader.match(/^Bearer (.+)$/)
  if (!match) {
    return { isValid: false, error: 'Invalid authorization format. Use: Bearer <api_key>' }
  }

  const apiKey = match[1]
  const validation = await validateApiKey(apiKey)

  if (!validation.isValid) {
    return { isValid: false, error: 'Invalid or expired API key' }
  }

  return validation
}

// Rate limiting simple (en memoria - en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  apiKeyId: string,
  maxRequests: number = 100,
  windowMinutes: number = 60
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowMs = windowMinutes * 60 * 1000
  const resetTime = Math.ceil(now / windowMs) * windowMs

  const current = rateLimitStore.get(apiKeyId)
  
  if (!current || current.resetTime < now) {
    // Nueva ventana o ventana expirada
    rateLimitStore.set(apiKeyId, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }

  current.count++
  return { 
    allowed: true, 
    remaining: maxRequests - current.count, 
    resetTime: current.resetTime 
  }
}

// Limpiar rate limits expirados (llamar periódicamente)
export function cleanupExpiredRateLimits(): void {
  const now = Date.now()
  for (const [key, value] of rateLimitStore) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}