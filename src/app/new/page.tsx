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

export default function NewDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center p-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg animate-pulse">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            WhatsApp SaaS ✨ NUEVO
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-8 pt-16 pb-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-8 py-4 mb-8 animate-bounce">
            <Sparkles className="h-6 w-6 text-emerald-400 animate-spin" />
            <span className="text-emerald-300 font-bold text-lg">🎉 DISEÑO NUEVO FUNCIONANDO</span>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              WhatsApp
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">
              SUPERPOTENCIADO 🚀
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            🎯 La plataforma más avanzada para automatizar tu WhatsApp Business con 
            <span className="text-emerald-400 font-bold"> IA BRUTAL 🤖</span> y 
            <span className="text-blue-400 font-bold"> automatización PRO ⚡</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-8 text-2xl font-black shadow-2xl shadow-emerald-500/25 transform hover:scale-110 transition-all duration-500 animate-pulse">
                <Rocket className="mr-4 h-8 w-8 animate-bounce" />
                🚀 ACCEDER AL DASHBOARD
                <ArrowRight className="ml-4 h-8 w-8 animate-pulse" />
              </Button>
            </Link>
            <Link href="/dashboard/whatsapp/sessions">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/20 px-12 py-8 text-2xl backdrop-blur-sm font-bold">
                <Smartphone className="mr-4 h-8 w-8" />
                📱 CONECTAR WHATSAPP
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center bg-emerald-500/10 p-6 rounded-2xl backdrop-blur-sm border border-emerald-500/20">
              <div className="text-5xl font-black text-emerald-400 mb-2 animate-pulse">∞</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider font-bold">MENSAJES</div>
            </div>
            <div className="text-center bg-blue-500/10 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/20">
              <div className="text-5xl font-black text-blue-400 mb-2">🤖</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider font-bold">GPT-4</div>
            </div>
            <div className="text-center bg-purple-500/10 p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20">
              <div className="text-5xl font-black text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider font-bold">AUTO</div>
            </div>
            <div className="text-center bg-yellow-500/10 p-6 rounded-2xl backdrop-blur-sm border border-yellow-500/20">
              <div className="text-5xl font-black text-yellow-400 mb-2 animate-bounce">0$</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider font-bold">MENSUAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="container mx-auto px-8 pb-12">
        <div className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <CheckCircle2 className="h-24 w-24 text-white mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-4">
              🎉 ¡EL NUEVO DISEÑO ESTÁ FUNCIONANDO!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Si puedes ver esta página con colores, gradientes y animaciones, 
              <span className="font-bold"> ¡el problema de caché está resuelto!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Rocket className="mr-3 h-6 w-6" />
                  IR AL DASHBOARD
                </Button>
              </Link>
              <Button size="lg" onClick={() => window.location.href = '/'} variant="outline" className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl backdrop-blur-sm">
                <ArrowRight className="mr-3 h-6 w-6" />
                PÁGINA PRINCIPAL
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-400">
            💫 WhatsApp SaaS - Nuevo Diseño Premium Funcionando
          </p>
        </div>
      </div>
    </div>
  )
}