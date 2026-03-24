import { Header } from '@/components/marketing/header'
import { Footer } from '@/components/marketing/footer'
import { 
  MessageCircle,
  Bot,
  Users,
  Zap,
  BarChart3,
  Shield,
  Search,
  Book,
  Video,
  Mail
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Centro de Ayuda - WhatsPower',
  description: 'Encuentra respuestas, guías y documentación para maximizar tu uso de WhatsPower.',
}

const helpCategories = [
  {
    title: "Primeros Pasos",
    description: "Todo lo necesario para configurar tu cuenta",
    icon: MessageCircle,
    color: "from-emerald-500 to-teal-500",
    articles: [
      "Crear tu primera sesión WhatsApp",
      "Conectar tu número de teléfono",
      "Configuración inicial básica",
      "Tour por el dashboard"
    ]
  },
  {
    title: "Bots IA",
    description: "Configurar y optimizar tu asistente virtual",
    icon: Bot,
    color: "from-blue-500 to-cyan-500",
    articles: [
      "Configurar GPT-4 para tu negocio",
      "Personalizar respuestas automáticas",
      "Entrenar tu bot con datos específicos",
      "Mejores prácticas conversacionales"
    ]
  },
  {
    title: "Gestión de Contactos",
    description: "Organizar y segmentar tu base de datos",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    articles: [
      "Importar contactos desde CSV",
      "Sistema de etiquetas y segmentación",
      "Campos personalizados avanzados",
      "Limpieza automática de datos"
    ]
  },
  {
    title: "Campañas y Automatización",
    description: "Crear flujos de trabajo automatizados",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    articles: [
      "Crear campañas masivas efectivas",
      "Automatizaciones con triggers",
      "Spintax y personalización masiva",
      "Programación de envíos"
    ]
  },
  {
    title: "Analytics y Métricas",
    description: "Medir y optimizar tus resultados",
    icon: BarChart3,
    color: "from-indigo-500 to-purple-500",
    articles: [
      "Interpretar métricas de conversión",
      "Reportes de rendimiento",
      "ROI y análisis de campañas",
      "Dashboards personalizados"
    ]
  },
  {
    title: "Seguridad y Cumplimiento",
    description: "Proteger tu cuenta y datos",
    icon: Shield,
    color: "from-slate-500 to-gray-500",
    articles: [
      "Configuración de seguridad 2FA",
      "Cumplimiento GDPR",
      "Backup y recuperación",
      "Políticas de uso WhatsApp"
    ]
  }
]

export default function HelpPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-20 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-32 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rotate-45 animate-bounce"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-500/30">
                <div className="flex items-center space-x-2 text-blue-400 font-mono text-sm">
                  <Book className="h-4 w-4" />
                  <span className="tracking-wider uppercase font-bold">Centro de Ayuda</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                ¿Necesitas
                <span className="block text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text">
                  Ayuda?
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300 font-medium leading-relaxed">
                Encuentra respuestas, guías paso a paso y documentación completa para 
                <span className="text-emerald-400 font-bold"> maximizar tu éxito</span> con WhatsPower.
              </p>
            </div>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar en la documentación..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Categories grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {helpCategories.map((category, index) => (
              <div key={category.title} className="group relative">
                {/* Glow effect */}
                <div className={`absolute -inset-1 rounded-3xl opacity-20 group-hover:opacity-40 blur transition-all duration-500 bg-gradient-to-r ${category.color}`}></div>
                
                <div className="relative h-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300">
                          {category.title}
                        </h3>
                        <p className="text-slate-400 font-medium text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Articles */}
                    <ul className="space-y-3">
                      {category.articles.map((article) => (
                        <li key={article} className="flex items-start space-x-3 group/item">
                          <div className="mt-2 w-1.5 h-1.5 bg-slate-600 rounded-full group-hover/item:bg-emerald-400 transition-colors duration-300"></div>
                          <a
                            href="#"
                            className="text-slate-400 hover:text-emerald-400 font-medium transition-colors duration-300 leading-relaxed"
                          >
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {/* Action */}
                    <div className="pt-4 border-t border-slate-800/50">
                      <a
                        href="#"
                        className="text-emerald-400 font-bold text-sm hover:text-emerald-300 transition-colors duration-300"
                      >
                        Ver todos los artículos →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/30">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Video Tutoriales</h3>
              <p className="text-slate-400">Aprende viendo paso a paso</p>
              <a
                href="#"
                className="inline-block bg-blue-500/20 text-blue-400 font-bold py-2 px-4 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
              >
                Ver Videos
              </a>
            </div>

            <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/30">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Chat en Vivo</h3>
              <p className="text-slate-400">Soporte instantáneo 24/7</p>
              <button className="bg-emerald-500/20 text-emerald-400 font-bold py-2 px-4 rounded-lg hover:bg-emerald-500/30 transition-colors duration-300">
                Iniciar Chat
              </button>
            </div>

            <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/30">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Contactar Soporte</h3>
              <p className="text-slate-400">Respuesta en menos de 2 horas</p>
              <a
                href="mailto:soporte@whatspower.com"
                className="inline-block bg-purple-500/20 text-purple-400 font-bold py-2 px-4 rounded-lg hover:bg-purple-500/30 transition-colors duration-300"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}