import { supabaseAdmin } from './supabase'
import crypto from 'crypto'

export interface Webhook {
  id: string
  sub_account_id: string
  name: string
  url: string
  events: WebhookEvent[]
  secret: string
  is_active: boolean
  headers: Record<string, string>
  retry_policy: {
    max_attempts: number
    backoff_seconds: number[]
  }
  created_at: string
  updated_at: string
  last_triggered_at?: string
  total_triggers: number
  failed_triggers: number
}

export type WebhookEvent = 
  | 'message.received'
  | 'message.sent'
  | 'message.delivered'
  | 'message.read'
  | 'contact.created'
  | 'contact.updated'
  | 'conversation.created'
  | 'conversation.updated'
  | 'campaign.started'
  | 'campaign.completed'
  | 'session.connected'
  | 'session.disconnected'

export interface WebhookPayload {
  id: string
  event: WebhookEvent
  timestamp: string
  data: any
  webhook_id: string
  sub_account_id: string
}

export const WEBHOOK_EVENTS: Record<WebhookEvent, string> = {
  'message.received': 'Mensaje recibido',
  'message.sent': 'Mensaje enviado',
  'message.delivered': 'Mensaje entregado',
  'message.read': 'Mensaje leído',
  'contact.created': 'Contacto creado',
  'contact.updated': 'Contacto actualizado',
  'conversation.created': 'Conversación creada',
  'conversation.updated': 'Conversación actualizada',
  'campaign.started': 'Campaña iniciada',
  'campaign.completed': 'Campaña completada',
  'session.connected': 'Sesión WhatsApp conectada',
  'session.disconnected': 'Sesión WhatsApp desconectada'
}

// Generar secret para webhook
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Crear signature para webhook
export function createWebhookSignature(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload, 'utf8')
  return `sha256=${hmac.digest('hex')}`
}

// Verificar signature de webhook
export function verifyWebhookSignature(
  payload: string, 
  signature: string, 
  secret: string
): boolean {
  const expectedSignature = createWebhookSignature(payload, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  )
}

// Crear nuevo webhook
export async function createWebhook(
  subAccountId: string,
  name: string,
  url: string,
  events: WebhookEvent[],
  headers?: Record<string, string>
): Promise<Webhook> {
  try {
    const secret = generateWebhookSecret()
    
    const { data, error } = await supabaseAdmin
      .from('webhooks')
      .insert({
        sub_account_id: subAccountId,
        name,
        url,
        events,
        secret,
        is_active: true,
        headers: headers || {},
        retry_policy: {
          max_attempts: 3,
          backoff_seconds: [1, 5, 15]
        },
        total_triggers: 0,
        failed_triggers: 0
      })
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error creating webhook:', error)
    throw error
  }
}

// Listar webhooks de una sub-cuenta
export async function listWebhooks(subAccountId: string): Promise<Webhook[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('webhooks')
      .select('*')
      .eq('sub_account_id', subAccountId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []

  } catch (error) {
    console.error('Error listing webhooks:', error)
    throw error
  }
}

// Actualizar webhook
export async function updateWebhook(
  webhookId: string,
  updates: Partial<Pick<Webhook, 'name' | 'url' | 'events' | 'is_active' | 'headers'>>
): Promise<Webhook> {
  try {
    const { data, error } = await supabaseAdmin
      .from('webhooks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', webhookId)
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error updating webhook:', error)
    throw error
  }
}

// Eliminar webhook
export async function deleteWebhook(webhookId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('webhooks')
      .delete()
      .eq('id', webhookId)

    if (error) throw error

  } catch (error) {
    console.error('Error deleting webhook:', error)
    throw error
  }
}

// Enviar webhook
export async function sendWebhook(
  webhook: Webhook,
  event: WebhookEvent,
  data: any,
  attempt: number = 1
): Promise<{ success: boolean; response?: any; error?: string }> {
  try {
    const payload: WebhookPayload = {
      id: crypto.randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      data,
      webhook_id: webhook.id,
      sub_account_id: webhook.sub_account_id
    }

    const payloadString = JSON.stringify(payload)
    const signature = createWebhookSignature(payloadString, webhook.secret)

    const headers = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'X-Webhook-Event': event,
      'X-Webhook-Id': payload.id,
      'User-Agent': 'WhatsAppSaaS-Webhook/1.0',
      ...webhook.headers
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: payloadString,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // Actualizar estadísticas
    await supabaseAdmin
      .from('webhooks')
      .update({
        total_triggers: webhook.total_triggers + 1,
        last_triggered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', webhook.id)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseData = await response.text()

    return {
      success: true,
      response: responseData
    }

  } catch (error: any) {
    console.error(`Webhook ${webhook.id} failed (attempt ${attempt}):`, error)

    // Actualizar contador de fallos
    await supabaseAdmin
      .from('webhooks')
      .update({
        failed_triggers: webhook.failed_triggers + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', webhook.id)

    // Retry logic
    if (attempt < webhook.retry_policy.max_attempts) {
      const delaySeconds = webhook.retry_policy.backoff_seconds[attempt - 1] || 15
      
      console.log(`Retrying webhook ${webhook.id} in ${delaySeconds} seconds...`)
      
      setTimeout(async () => {
        await sendWebhook(webhook, event, data, attempt + 1)
      }, delaySeconds * 1000)
    }

    return {
      success: false,
      error: error.message
    }
  }
}

// Trigger webhook para evento específico
export async function triggerWebhooks(
  subAccountId: string,
  event: WebhookEvent,
  data: any
): Promise<void> {
  try {
    const webhooks = await listWebhooks(subAccountId)
    
    const relevantWebhooks = webhooks.filter(
      webhook => webhook.is_active && webhook.events.includes(event)
    )

    // Enviar webhooks en paralelo
    const promises = relevantWebhooks.map(webhook => 
      sendWebhook(webhook, event, data)
    )

    await Promise.allSettled(promises)

  } catch (error) {
    console.error('Error triggering webhooks:', error)
  }
}

// Generar template para N8N
export function generateN8nTemplate(webhook: Webhook): object {
  return {
    name: `WhatsApp SaaS - ${webhook.name}`,
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'whatsapp-webhook',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        },
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        webhookId: crypto.randomUUID()
      },
      {
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: '',
              typeValidation: 'strict'
            },
            conditions: [
              {
                id: crypto.randomUUID(),
                leftValue: '={{ $json.event }}',
                rightValue: 'message.received',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ],
            combinator: 'and'
          }
        },
        name: 'Filter Messages',
        type: 'n8n-nodes-base.if',
        position: [450, 300]
      },
      {
        parameters: {
          content: '=Received message: {{ $json.data.content }}',
          subject: '=New WhatsApp Message from {{ $json.data.contact.name }}'
        },
        name: 'Process Message',
        type: 'n8n-nodes-base.set',
        position: [650, 200]
      }
    ],
    connections: {
      'Webhook': {
        main: [
          [
            {
              node: 'Filter Messages',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      'Filter Messages': {
        main: [
          [
            {
              node: 'Process Message',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  }
}

// Validar URL de webhook
export function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsedUrl = new URL(url)
    
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS' }
    }

    if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname.startsWith('127.')) {
      return { valid: false, error: 'Localhost URLs are not allowed' }
    }

    return { valid: true }

  } catch (error) {
    return { valid: false, error: 'Invalid URL format' }
  }
}

// Test webhook
export async function testWebhook(webhook: Webhook): Promise<{
  success: boolean
  statusCode?: number
  responseTime?: number
  error?: string
}> {
  const startTime = Date.now()
  
  try {
    const testPayload = {
      id: 'test-' + crypto.randomUUID(),
      event: 'message.received' as WebhookEvent,
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        message: 'This is a test webhook from WhatsApp SaaS'
      },
      webhook_id: webhook.id,
      sub_account_id: webhook.sub_account_id
    }

    const result = await sendWebhook(webhook, 'message.received', testPayload.data)
    const responseTime = Date.now() - startTime

    return {
      success: result.success,
      statusCode: result.success ? 200 : undefined,
      responseTime,
      error: result.error
    }

  } catch (error: any) {
    return {
      success: false,
      responseTime: Date.now() - startTime,
      error: error.message
    }
  }
}