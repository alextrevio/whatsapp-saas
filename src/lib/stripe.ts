import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export const STRIPE_CONFIG = {
  plans: {
    free: {
      name: 'Free',
      price: 0,
      priceId: null,
      limits: {
        contacts: 100,
        messagesPerMonth: 1000,
        whatsappSessions: 1,
        campaigns: 5,
        apiCalls: 1000,
      },
      features: [
        'Hasta 100 contactos',
        '1,000 mensajes/mes',
        '1 sesión WhatsApp',
        '5 campañas activas',
        'Soporte por email'
      ]
    },
    pro: {
      name: 'Pro',
      price: 49,
      priceId: process.env.STRIPE_PRICE_ID_PRO,
      limits: {
        contacts: 5000,
        messagesPerMonth: 25000,
        whatsappSessions: 5,
        campaigns: 50,
        apiCalls: 50000,
      },
      features: [
        'Hasta 5,000 contactos',
        '25,000 mensajes/mes',
        '5 sesiones WhatsApp',
        '50 campañas activas',
        'API completa',
        'Webhooks',
        'Soporte prioritario'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
      limits: {
        contacts: 50000,
        messagesPerMonth: 500000,
        whatsappSessions: 20,
        campaigns: 200,
        apiCalls: 1000000,
      },
      features: [
        'Hasta 50,000 contactos',
        '500,000 mensajes/mes',
        '20 sesiones WhatsApp',
        '200 campañas activas',
        'API completa',
        'Webhooks avanzados',
        'White-label',
        'Sub-cuentas ilimitadas',
        'Soporte dedicado',
        'SLA 99.9%'
      ]
    }
  }
}

export type PlanType = keyof typeof STRIPE_CONFIG.plans
export type PlanLimits = typeof STRIPE_CONFIG.plans.free.limits

// Crear customer en Stripe
export async function createStripeCustomer(
  email: string,
  name: string,
  organizationId: string
): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId
    }
  })
}

// Crear subscription
export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  })
}

// Crear checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  })
}

// Crear portal session para gestión de facturación
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Obtener subscription activa
export async function getActiveSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })

  return subscriptions.data[0] || null
}

// Cancelar subscription
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId)
}

// Verificar límites del plan
export function checkPlanLimits(
  plan: PlanType,
  usage: {
    contacts?: number
    messagesThisMonth?: number
    whatsappSessions?: number
    campaigns?: number
    apiCallsThisMonth?: number
  }
): {
  isValid: boolean
  exceededLimits: string[]
} {
  const limits = STRIPE_CONFIG.plans[plan].limits
  const exceededLimits: string[] = []

  if (usage.contacts && usage.contacts > limits.contacts) {
    exceededLimits.push(`Contactos: ${usage.contacts}/${limits.contacts}`)
  }

  if (usage.messagesThisMonth && usage.messagesThisMonth > limits.messagesPerMonth) {
    exceededLimits.push(`Mensajes/mes: ${usage.messagesThisMonth}/${limits.messagesPerMonth}`)
  }

  if (usage.whatsappSessions && usage.whatsappSessions > limits.whatsappSessions) {
    exceededLimits.push(`Sesiones WhatsApp: ${usage.whatsappSessions}/${limits.whatsappSessions}`)
  }

  if (usage.campaigns && usage.campaigns > limits.campaigns) {
    exceededLimits.push(`Campañas: ${usage.campaigns}/${limits.campaigns}`)
  }

  if (usage.apiCallsThisMonth && usage.apiCallsThisMonth > limits.apiCalls) {
    exceededLimits.push(`API calls/mes: ${usage.apiCallsThisMonth}/${limits.apiCalls}`)
  }

  return {
    isValid: exceededLimits.length === 0,
    exceededLimits
  }
}

// Construir URL de precios dinámicos
export function getPricingUrl(plan: PlanType): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/pricing?plan=${plan}`
}

// Formatear precio
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}