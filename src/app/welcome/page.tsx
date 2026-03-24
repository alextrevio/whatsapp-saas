'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MessageCircle, 
  Bot, 
  Zap, 
  BarChart3,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Rocket,
  Shield,
  Smartphone,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center p-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            WhatsApp SaaS
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-8 pt-16 pb-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">Herramienta Interna Premium</span>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              WhatsApp
            </span>
            <br />
            <span className="text-white drop-shadow-lg">
              Superpotenciado
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            La plataforma más avanzada para automatizar tu WhatsApp Business con 
            <span className="text-emerald-400 font-bold"> IA, automatización, CRM</span> y 
            <span className="text-blue-400 font-bold"> analíticas profesionales</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-10 py-6 text-xl font-bold shadow-2xl shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300">
                <Rocket className="mr-3 h-7 w-7" />
                Acceder al Dashboard
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
            <Link href="/dashboard/whatsapp/sessions">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-xl backdrop-blur-sm">
                <Smartphone className="mr-3 h-7 w-7" />
                Conectar WhatsApp
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">∞</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Mensajes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400 mb-2">AI</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">GPT-4</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Automático</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-yellow-400 mb-2">0$</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Mensual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 - Bot IA */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Bot IA Inteligente</h3>
                  <p className="text-emerald-400 font-semibold">GPT-4 Powered</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Conversaciones naturales, calificación automática de leads y 3 personalidades que se adaptan a tu negocio.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-300">Respuestas instantáneas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-300">Lead scoring automático</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-300">Handoff inteligente</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2 - Automatizaciones */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Automatizaciones Avanzadas</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Flujos automáticos por keywords, tiempo y comportamiento. Más potente que GoHighLevel.
              </p>
              <div className="text-blue-400 font-semibold text-sm">
                Workflows Ilimitados
              </div>
            </CardContent>
          </Card>

          {/* Feature 3 - CRM */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">CRM Integrado</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Gestión completa de contactos, leads y conversaciones con scoring inteligente.
              </p>
              <div className="text-purple-400 font-semibold text-sm">
                Contactos Ilimitados
              </div>
            </CardContent>
          </Card>

          {/* Feature 4 - Inbox */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Inbox Unificado</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Todas las conversaciones en tiempo real con switch automático bot/humano.
              </p>
              <div className="text-orange-400 font-semibold text-sm">
                Real-time
              </div>
            </CardContent>
          </Card>

          {/* Feature 5 - Analytics */}
          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-xl border-pink-500/20 hover:border-pink-400/50 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Analíticas Pro</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Métricas avanzadas, conversiones y performance en tiempo real.
              </p>
              <div className="text-pink-400 font-semibold text-sm">
                Dashboards Personalizados
              </div>
            </CardContent>
          </Card>

          {/* Feature 6 - Multi-WhatsApp */}
          <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 backdrop-blur-xl border-teal-500/20 hover:border-teal-400/50 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Múltiples WhatsApp</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Conecta múltiples números, gestiona sesiones independientes con bots específicos.
              </p>
              <div className="text-teal-400 font-semibold text-sm">
                Números Ilimitados
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-8 pb-20">
        <Card className="bg-gradient-to-r from-emerald-600/80 to-blue-600/80 backdrop-blur-xl border-white/10">
          <CardContent className="p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-white/10 rounded-full">
                  <Shield className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                🚀 Tu GoHighLevel Personal
              </h2>
              <p className="text-2xl text-white/90 mb-10 leading-relaxed">
                <span className="font-bold">Sin límites, sin costos mensuales, sin restricciones.</span>
                <br />
                Todo el poder de WhatsApp Business automatizado con IA.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-16 py-6 text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Rocket className="mr-4 h-8 w-8" />
                    Comenzar Ahora
                  </Button>
                </Link>
                <Link href="/dashboard/whatsapp/sessions">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-16 py-6 text-2xl backdrop-blur-sm">
                    <MessageCircle className="mr-4 h-8 w-8" />
                    Ver Sistema
                  </Button>
                </Link>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-white/20">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                  <div className="text-white font-semibold">Sin Límites</div>
                  <div className="text-white/70 text-sm">Mensajes ilimitados</div>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                  <div className="text-white font-semibold">IA Avanzada</div>
                  <div className="text-white/70 text-sm">GPT-4 integrado</div>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                  <div className="text-white font-semibold">Cero Mensual</div>
                  <div className="text-white/70 text-sm">Solo hosting</div>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                  <div className="text-white font-semibold">Control Total</div>
                  <div className="text-white/70 text-sm">Tu propio código</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}