'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Package, 
  Users, 
  MessageSquare,
  Smartphone,
  Send,
  Zap,
  Crown,
  Settings,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import { STRIPE_CONFIG, type PlanType } from '@/lib/stripe'

interface UsageData {
  contacts: { used: number; limit: number }
  messages: { used: number; limit: number }
  sessions: { used: number; limit: number }
  campaigns: { used: number; limit: number }
  apiCalls: { used: number; limit: number }
}

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free')
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState<UsageData>({
    contacts: { used: 45, limit: 100 },
    messages: { used: 387, limit: 1000 },
    sessions: { used: 1, limit: 1 },
    campaigns: { used: 2, limit: 5 },
    apiCalls: { used: 156, limit: 1000 }
  })

  const [billingInfo, setBillingInfo] = useState({
    nextBillingDate: '2024-02-15',
    amount: 49,
    paymentMethod: '**** 4242',
    status: 'active'
  })

  const handleUpgrade = async (plan: PlanType) => {
    setLoading(true)
    try {
      // En implementación real, llamarías a tu API para crear checkout session
      console.log('Upgrading to plan:', plan)
      
      // Simular upgrade
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aquí redirigiría a Stripe Checkout
      // window.location.href = checkoutUrl
      
    } catch (error) {
      console.error('Error upgrading plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      // En implementación real, crearías portal session
      console.log('Opening billing portal...')
      
      // Simular portal
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // window.location.href = portalUrl
      
    } catch (error) {
      console.error('Error opening billing portal:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUsagePercentage = (used: number, limit: number): number => {
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (used: number, limit: number): string => {
    const percentage = getUsagePercentage(used, limit)
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Facturación y Planes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra tu suscripción y revisa el uso de tu cuenta
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                Plan Actual: {STRIPE_CONFIG.plans[currentPlan].name}
              </CardTitle>
              <CardDescription>
                ${STRIPE_CONFIG.plans[currentPlan].price}/mes
                {currentPlan === 'free' && ' - Gratis para siempre'}
              </CardDescription>
            </div>
            <Badge 
              className={
                billingInfo.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }
            >
              {billingInfo.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlan !== 'free' && (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Próxima facturación: {new Date(billingInfo.nextBillingDate).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Método de pago: {billingInfo.paymentMethod}
                </p>
              </div>
              <Button variant="outline" onClick={handleManageBilling} disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
                Gestionar Facturación
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {STRIPE_CONFIG.plans[currentPlan].features.slice(0, 5).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Uso Actual</CardTitle>
          <CardDescription>
            Tu uso este mes comparado con los límites de tu plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contacts */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Contactos</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(usage.contacts.used, usage.contacts.limit)}`}>
                {formatNumber(usage.contacts.used)} / {formatNumber(usage.contacts.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.contacts.used, usage.contacts.limit)} 
              className="h-2"
            />
          </div>

          {/* Messages */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Mensajes este mes</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(usage.messages.used, usage.messages.limit)}`}>
                {formatNumber(usage.messages.used)} / {formatNumber(usage.messages.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.messages.used, usage.messages.limit)} 
              className="h-2"
            />
          </div>

          {/* WhatsApp Sessions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Sesiones WhatsApp</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(usage.sessions.used, usage.sessions.limit)}`}>
                {formatNumber(usage.sessions.used)} / {formatNumber(usage.sessions.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.sessions.used, usage.sessions.limit)} 
              className="h-2"
            />
          </div>

          {/* Campaigns */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Campañas activas</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(usage.campaigns.used, usage.campaigns.limit)}`}>
                {formatNumber(usage.campaigns.used)} / {formatNumber(usage.campaigns.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.campaigns.used, usage.campaigns.limit)} 
              className="h-2"
            />
          </div>

          {/* API Calls */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Llamadas API este mes</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(usage.apiCalls.used, usage.apiCalls.limit)}`}>
                {formatNumber(usage.apiCalls.used)} / {formatNumber(usage.apiCalls.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.apiCalls.used, usage.apiCalls.limit)} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(STRIPE_CONFIG.plans).map(([planKey, plan]) => (
          <Card 
            key={planKey}
            className={`relative ${
              planKey === currentPlan 
                ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                : ''
            }`}
          >
            {planKey === 'pro' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  Más Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{plan.name}</CardTitle>
                {planKey === currentPlan && (
                  <Badge variant="outline">Plan Actual</Badge>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-base font-normal">/mes</span>}
                </div>
                {plan.price === 0 && (
                  <p className="text-sm text-gray-500">Gratis para siempre</p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {planKey !== currentPlan && (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade(planKey as PlanType)}
                  disabled={loading}
                  variant={planKey === 'pro' ? 'default' : 'outline'}
                >
                  {planKey === 'free' ? 'Cambiar a Gratuito' : `Actualizar a ${plan.name}`}
                </Button>
              )}

              {planKey === currentPlan && planKey !== 'free' && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleManageBilling}
                  disabled={loading}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Gestionar Suscripción
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Historial de Facturación
          </CardTitle>
          <CardDescription>
            Tus últimas facturas y pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock billing history */}
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Plan Pro - Enero 2024</p>
                <p className="text-sm text-gray-500">15 de enero, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$49.00</p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Pagado
                </Badge>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Plan Pro - Diciembre 2023</p>
                <p className="text-sm text-gray-500">15 de diciembre, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$49.00</p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Pagado
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Ver Historial Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}