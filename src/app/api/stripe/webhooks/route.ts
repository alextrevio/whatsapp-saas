import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)

  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string)
    
    if (customer.deleted) {
      throw new Error('Customer was deleted')
    }

    const organizationId = customer.metadata?.organizationId

    if (!organizationId) {
      throw new Error('No organization ID found in customer metadata')
    }

    // Determinar el plan basado en el price ID
    let plan = 'free'
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id
      
      if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
        plan = 'pro'
      } else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) {
        plan = 'enterprise'
      }
    }

    // Actualizar organización con datos de suscripción
    const { error } = await supabaseAdmin
      .from('organizations')
      .update({
        plan: plan as any,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', organizationId)

    if (error) {
      throw error
    }

    console.log(`Organization ${organizationId} updated to ${plan} plan`)

  } catch (error) {
    console.error('Error handling subscription created:', error)
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)

  try {
    // Determinar el nuevo plan
    let plan = 'free'
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id
      
      if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
        plan = 'pro'
      } else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) {
        plan = 'enterprise'
      }
    }

    // Si la suscripción fue cancelada, cambiar a plan gratuito
    if (subscription.status === 'canceled') {
      plan = 'free'
    }

    // Actualizar organización
    const { error } = await supabaseAdmin
      .from('organizations')
      .update({
        plan: plan as any,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      throw error
    }

    console.log(`Subscription ${subscription.id} updated to ${plan} plan`)

  } catch (error) {
    console.error('Error handling subscription updated:', error)
    throw error
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)

  try {
    // Cambiar organización a plan gratuito
    const { error } = await supabaseAdmin
      .from('organizations')
      .update({
        plan: 'free',
        stripe_subscription_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      throw error
    }

    console.log(`Subscription ${subscription.id} deleted, organization moved to free plan`)

  } catch (error) {
    console.error('Error handling subscription deleted:', error)
    throw error
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id)

  // Aquí podrías enviar emails de confirmación, actualizar métricas, etc.
  // Por ahora solo loggeamos el evento
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id)

  // Aquí podrías enviar emails de notificación de pago fallido
  // También podrías pausar servicios después de varios intentos fallidos
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log('Customer created:', customer.id)

  // El customer ya debería estar asociado a una organización
  // Este evento es principalmente informativo
}