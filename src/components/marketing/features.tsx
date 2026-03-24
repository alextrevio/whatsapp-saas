'use client'

import { 
  Bot,
  MessageCircle,
  Users,
  Zap,
  BarChart3,
  Shield,
  Rocket,
  Crown,
  Star,
  Lightning,
  Globe,
  Target,
  Sparkles,
  ArrowRight,
  Hexagon,
  Triangle,
  Circle,
  Orbit
} from 'lucide-react'

const features = [
  {
    category: "IA & Automatización",
    items: [
      {
        name: "Bots IA Avanzados",
        description: "GPT-4 integrado para respuestas inteligentes y conversaciones naturales que convierten leads en clientes.",
        icon: Bot,
        color: "from-emerald-500 to-teal-500",
        premium: true
      },
      {
        name: "Automatización Completa",
        description: "Flujos automatizados que trabajan 24/7. Desde el primer mensaje hasta la conversión final.",
        icon: Zap,
        color: "from-purple-500 to-pink-500",
        premium: true
      },
      {
        name: "Respuestas Instantáneas",
        description: "Menos de 2 segundos promedio. Tus clientes nunca esperan, tu negocio nunca para.",
        icon: Lightning,
        color: "from-orange-500 to-red-500",
        premium: false
      }
    ]
  },
  {
    category: "Gestión & Escalabilidad",
    items: [
      {
        name: "Multi-Sesión WhatsApp",
        description: "Conecta ilimitados números de WhatsApp desde una sola plataforma. Escala sin límites.",
        icon: MessageCircle,
        color: "from-blue-500 to-cyan-500",
        premium: false
      },
      {
        name: "CRM Inteligente",
        description: "Gestión automática de contactos con tags, segmentación y scoring predictivo de leads.",
        icon: Users,
        color: "from-indigo-500 to-purple-500",
        premium: false
      },
      {
        name: "Campañas Masivas",
        description: "Envía a miles simultáneamente con personalización individual. Spintax incluido.",
        icon: Target,
        color: "from-green-500 to-emerald-500",
        premium: false
      }
    ]
  },
  {
    category: "Analytics & Seguridad",
    items: [
      {
        name: "Analytics en Tiempo Real",
        description: "Dashboards live con métricas que importan: conversión, engagement y ROI.",
        icon: BarChart3,
        color: "from-cyan-500 to-blue-500",
        premium: false
      },
      {
        name: "Seguridad Enterprise",
        description: "Encriptación end-to-end, backup automático y compliance GDPR completo.",
        icon: Shield,
        color: "from-slate-500 to-gray-500",
        premium: true
      },
      {
        name: "API Global",
        description: "Integra con cualquier sistema. Webhooks, REST API y SDKs para 150+ países.",
        icon: Globe,
        color: "from-teal-500 to-green-500",
        premium: true
      }
    ]
  }
]

export function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Geometric shapes floating */}
        <div className="absolute top-1/4 left-20 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-32 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full animate-pulse delay-1000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-sm">
                <Sparkles className="h-4 w-4" />
                <span className="tracking-wider uppercase font-bold">Funcionalidades</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
              Tecnología
              <span className="block text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text">
                de Vanguardia
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300 font-medium leading-relaxed">
              Cada característica diseñada para <span className="text-emerald-400 font-bold">maximizar resultados</span>. 
              Desde IA conversacional hasta análisis predictivos.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-20">
          {features.map((category, categoryIndex) => (
            <div key={category.category} className="space-y-12">
              {/* Category Header */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    categoryIndex === 0 ? 'bg-emerald-400' :
                    categoryIndex === 1 ? 'bg-blue-400' :
                    'bg-purple-400'
                  } animate-pulse`}></div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {category.category}
                  </h3>
                  <div className={`w-3 h-3 rounded-full ${
                    categoryIndex === 0 ? 'bg-emerald-400' :
                    categoryIndex === 1 ? 'bg-blue-400' :
                    'bg-purple-400'
                  } animate-pulse delay-500`}></div>
                </div>
              </div>

              {/* Features Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {category.items.map((feature, index) => (
                  <div key={feature.name} className="group relative">
                    {/* Glow effect */}
                    <div className={`absolute -inset-1 rounded-3xl opacity-20 group-hover:opacity-40 blur transition-all duration-500 bg-gradient-to-r ${feature.color}`}></div>
                    
                    {/* Premium badge */}
                    {feature.premium && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-3 py-1 rounded-xl font-black shadow-lg border border-yellow-300 flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          PRO
                        </div>
                      </div>
                    )}

                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full group-hover:-translate-y-2 transition-all duration-500">
                      <div className="space-y-6">
                        {/* Icon */}
                        <div className="flex items-center space-x-4">
                          <div className={`p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 bg-gradient-to-br ${feature.color}`}>
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                          
                          {feature.premium && (
                            <div className="flex space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <h4 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 group-hover:bg-clip-text transition-all duration-300">
                            {feature.name}
                          </h4>
                          <p className="text-slate-400 font-medium leading-relaxed text-lg">
                            {feature.description}
                          </p>
                        </div>

                        {/* Action indicator */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                          <div className="flex items-center text-emerald-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                            <Rocket className="mr-2 h-4 w-4" />
                            ACTIVAR
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-40 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                      <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-20 group-hover:opacity-60 transition-opacity delay-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/50 to-transparent h-px"></div>
            <div className="relative bg-slate-900 px-8 pb-12">
              <Orbit className="h-12 w-12 mx-auto text-emerald-400 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-white">
              ¿Listo para <span className="text-emerald-400">revolucionar</span> tu WhatsApp?
            </h3>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Únete a más de 10,000 empresas que ya están dominando WhatsApp con tecnología de vanguardia
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}