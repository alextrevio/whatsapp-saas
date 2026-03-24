'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Rocket,
  Sparkles,
  Zap,
  Bot,
  MessageCircle,
  Users,
  Crown,
  Star,
  ArrowRight,
  Play,
  Globe,
  Shield,
  Target,
  Orbit,
  Triangle,
  Hexagon,
  Circle
} from 'lucide-react'

const stats = [
  { number: '50K+', label: 'Mensajes/día', icon: MessageCircle },
  { number: '99.9%', label: 'Uptime', icon: Shield },
  { number: '2.5s', label: 'Respuesta avg', icon: Zap },
  { number: '150+', label: 'Países', icon: Globe },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-32 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-20 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-400/20 rotate-12 animate-bounce delay-500"></div>
        
        {/* Geometric icons floating */}
        <div className="absolute top-1/3 left-1/4">
          <Hexagon className="w-16 h-16 text-blue-400/30 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <div className="absolute top-1/2 right-1/4">
          <Triangle className="w-12 h-12 text-emerald-400/30 animate-bounce" />
        </div>
        <div className="absolute bottom-1/4 left-1/2">
          <Circle className="w-20 h-20 text-purple-400/30 animate-pulse" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05)_1px,transparent_1px)] bg-[length:32px_32px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="text-center space-y-12">
          {/* Announcement badge */}
          <div className="inline-flex items-center space-x-3">
            <div className="relative">
              <div className="px-6 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
                <div className="flex items-center space-x-3 text-emerald-400 font-mono text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-300"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-700"></div>
                  </div>
                  <span className="tracking-wider uppercase font-bold">Nuevo: Bot IA GPT-4</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Main headline - Cyberpunk style */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-emerald-400 font-mono text-lg tracking-wider uppercase font-bold">
                // WhatsApp Automation Revolution
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tight">
                Domina
                <span className="block text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text animate-pulse">
                  WhatsApp
                </span>
                como un PRO
              </h1>
            </div>
            
            <p className="mx-auto max-w-3xl text-xl lg:text-2xl text-slate-300 font-medium leading-relaxed">
              Conecta <span className="text-emerald-400 font-bold">bots IA</span>, automatiza <span className="text-blue-400 font-bold">campañas masivas</span> y convierte cada conversación en <span className="text-purple-400 font-bold">resultados reales</span>. 
              La plataforma definitiva para empresas que van en serio.
            </p>
          </div>

          {/* Epic CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black px-10 py-6 text-lg rounded-2xl shadow-2xl border-2 border-emerald-400 hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Rocket className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Comenzar Gratis
                  <Crown className="ml-3 h-6 w-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </Button>
            </Link>
            
            <Button size="lg" variant="outline" className="group bg-transparent border-2 border-slate-600 text-white hover:bg-white hover:text-slate-900 font-bold px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center">
                <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Ver Demo
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8">
            <div className="text-slate-400 font-mono text-sm mb-6 tracking-wider uppercase">
              Empresas que confían en nosotros
            </div>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-2xl font-black text-white">ACME Corp</div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="text-2xl font-black text-white">TechFlow</div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="text-2xl font-black text-white">Innovate</div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="text-2xl font-black text-white">NextGen</div>
            </div>
          </div>
        </div>

        {/* Stats grid - Gaming inspired */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="group relative">
              <div className={`absolute -inset-1 rounded-2xl opacity-30 group-hover:opacity-60 blur transition-all duration-500 ${
                index === 0 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                index === 1 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                index === 2 ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                'bg-gradient-to-r from-orange-400 to-red-400'
              }`}></div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center group-hover:-translate-y-1 transition-all duration-300">
                <div className={`mx-auto w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                  index === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                  index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                  index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                  'bg-gradient-to-br from-orange-500 to-red-500'
                } group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom gradient separator */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-slate-900 px-6">
              <Orbit className="h-8 w-8 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}