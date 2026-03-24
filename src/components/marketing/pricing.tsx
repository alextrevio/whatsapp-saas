'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Check,
  Crown,
  Rocket,
  Zap,
  Star,
  Shield,
  Sparkles,
  ArrowRight,
  Bot,
  MessageCircle,
  Users,
  Target,
  Globe,
  BarChart3
} from 'lucide-react'

const plans = [
  {
    name: "Starter",
    tagline: "Ideal para comenzar",
    price: { monthly: 29, yearly: 24 },
    description: "Perfecto para pequeñas empresas que quieren automatizar WhatsApp",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    popular: false,
    features: [
      "1 número de WhatsApp",
      "500 mensajes/mes",
      "Bot básico sin IA", 
      "1,000 contactos",
      "Soporte por email",
      "Plantillas prediseñadas",
      "Analytics básicos"
    ],
    limitations: [
      "Sin IA avanzada",
      "Sin campañas masivas",
      "Sin integraciones"
    ]
  },
  {
    name: "Professional",
    tagline: "Recomendado para crecer",
    price: { monthly: 79, yearly: 65 },
    description: "Para empresas serias que buscan resultados profesionales",
    icon: Crown,
    color: "from-emerald-500 to-teal-500",
    popular: true,
    features: [
      "5 números de WhatsApp",
      "5,000 mensajes/mes",
      "Bot IA GPT-4 incluido",
      "25,000 contactos",
      "Soporte prioritario",
      "Campañas automatizadas",
      "Analytics avanzados",
      "Integración API",
      "Webhooks N8N",
      "Templates ilimitados"
    ]
  },
  {
    name: "Enterprise", 
    tagline: "Para empresas grandes",
    price: { monthly: 199, yearly: 165 },
    description: "Solución completa para corporaciones y agencias",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    popular: false,
    features: [
      "Números ilimitados",
      "50,000 mensajes/mes",
      "IA personalizada",
      "Contactos ilimitados", 
      "Soporte 24/7",
      "White-label completo",
      "Multi-tenant",
      "Integraciones avanzadas",
      "Analytics enterprise",
      "Onboarding personalizado",
      "SLA garantizado"
    ]
  }
]

const additionalFeatures = [
  { icon: Bot, text: "IA conversacional GPT-4" },
  { icon: MessageCircle, text: "Multi-sesión WhatsApp" },
  { icon: Users, text: "CRM inteligente" },
  { icon: Target, text: "Campañas masivas" },
  { icon: Globe, text: "API global" },
  { icon: BarChart3, text: "Analytics en tiempo real" }
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-sm">
                <Crown className="h-4 w-4" />
                <span className="tracking-wider uppercase font-bold">Precios</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
              Planes que
              <span className="block text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                Escalan Contigo
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300 font-medium leading-relaxed">
              Desde startup hasta enterprise. <span className="text-emerald-400 font-bold">Paga solo por lo que necesitas</span>, 
              escala cuando estés listo. Sin sorpresas, sin límites ocultos.
            </p>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center space-x-6 mb-12">
          <span className={`text-lg font-bold ${!isYearly ? 'text-white' : 'text-slate-500'}`}>
            Mensual
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
              isYearly ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-700'
            }`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              isYearly ? 'translate-x-9' : 'translate-x-1'
            }`} />
          </button>
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-bold ${isYearly ? 'text-white' : 'text-slate-500'}`}>
              Anual
            </span>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm px-3 py-1 rounded-full font-bold">
              -20%
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div key={plan.name} className="group relative">
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm px-6 py-2 rounded-full font-black shadow-xl border-2 border-emerald-400 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    MÁS POPULAR
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </div>
                </div>
              )}

              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-3xl opacity-30 group-hover:opacity-60 blur transition-all duration-500 ${
                plan.popular ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : `bg-gradient-to-r ${plan.color}`
              }`}></div>

              <div className={`relative h-full bg-slate-900/90 backdrop-blur-xl border-2 ${
                plan.popular ? 'border-emerald-400/50' : 'border-slate-700/50'
              } rounded-3xl p-8 group-hover:-translate-y-2 transition-all duration-500`}>
                
                <div className="space-y-8">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${plan.color} group-hover:scale-110 transition-transform duration-300`}>
                        <plan.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                        <p className="text-sm text-slate-400 font-medium">{plan.tagline}</p>
                      </div>
                    </div>

                    <p className="text-slate-400 font-medium leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-black text-white">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-slate-400 font-medium">
                        /{isYearly ? 'mes' : 'mes'}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-emerald-400 font-bold">
                        Ahorra ${(plan.price.monthly - plan.price.yearly) * 12}/año
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href="/register">
                    <Button className={`w-full py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                        : 'bg-transparent border-2 border-slate-600 text-white hover:bg-white hover:text-slate-900'
                    }`}>
                      <div className="flex items-center justify-center">
                        {plan.popular ? (
                          <>
                            <Rocket className="mr-2 h-5 w-5" />
                            Comenzar Ahora
                            <Zap className="ml-2 h-5 w-5 text-yellow-300" />
                          </>
                        ) : (
                          <>
                            Comenzar con {plan.name}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </div>
                    </Button>
                  </Link>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="text-lg font-bold text-white">
                      ✨ Incluye:
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start space-x-3">
                          <div className="mt-0.5 p-1 bg-emerald-500/20 rounded-full">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </div>
                          <span className="text-slate-300 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-40 animate-pulse delay-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional features showcase */}
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white">
              Todas las funciones <span className="text-emerald-400">premium</span> incluidas
            </h3>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Sin características ocultas. Todo lo que necesitas para dominar WhatsApp está aquí.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={feature.text} className="group text-center">
                <div className={`mx-auto w-16 h-16 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                  index % 3 === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                  index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                  'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-purple-400" />
              <h3 className="text-3xl font-black text-white">¿Necesitas algo más grande?</h3>
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Para agencias, corporaciones y necesidades específicas, diseñamos soluciones a medida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl">
                <Crown className="mr-2 h-5 w-5" />
                Contactar Ventas
              </Button>
              <Button variant="outline" className="border-2 border-slate-600 text-white hover:bg-white hover:text-slate-900 font-bold px-8 py-4 rounded-2xl">
                Ver Demo Personalizada
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}