import { Header } from '@/components/marketing/header'
import { Footer } from '@/components/marketing/footer'
import { 
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
  Bot,
  BarChart3,
  MessageCircle
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - WhatsPower',
  description: 'Estrategias, tips y tendencias de WhatsApp Marketing. Aprende a dominar la automatización.',
}

const featuredPost = {
  title: "10 Estrategias de WhatsApp Marketing que Triplicarán tus Ventas en 2024",
  excerpt: "Descubre las técnicas avanzadas que las empresas líderes están usando para convertir conversaciones de WhatsApp en resultados extraordinarios.",
  author: "María González",
  date: "15 Mar 2024",
  readTime: "8 min lectura",
  category: "Estrategia",
  image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400",
  featured: true
}

const blogPosts = [
  {
    title: "Cómo Configurar Bots IA que Realmente Conviertan",
    excerpt: "Guía paso a paso para crear conversaciones automatizadas que no parecen robots.",
    author: "Carlos Mendoza",
    date: "12 Mar 2024",
    readTime: "6 min",
    category: "Automatización",
    icon: Bot,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Métricas de WhatsApp Marketing: Qué Medir y Por Qué",
    excerpt: "Los KPIs esenciales que todo marketero debe rastrear para optimizar campañas.",
    author: "Ana Rodríguez",
    date: "10 Mar 2024", 
    readTime: "5 min",
    category: "Analytics",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Automatización vs Personalización: Encontrando el Balance",
    excerpt: "Cómo mantener el toque humano en conversaciones automatizadas.",
    author: "Diego Torres",
    date: "8 Mar 2024",
    readTime: "7 min", 
    category: "Estrategia",
    icon: Zap,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Casos de Éxito: De 0 a $50K MRR con WhatsApp",
    excerpt: "Historia real de una startup que escaló usando solo automatización de WhatsApp.",
    author: "Patricia Silva",
    date: "5 Mar 2024",
    readTime: "9 min",
    category: "Casos de Éxito",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "API de WhatsApp: Integración Completa para Desarrolladores",
    excerpt: "Tutorial técnico para integrar WhatsApp Business API en tu aplicación.",
    author: "Roberto Kim",
    date: "3 Mar 2024",
    readTime: "12 min",
    category: "Desarrollo",
    icon: MessageCircle,
    color: "from-indigo-500 to-purple-500"
  }
]

const categories = [
  "Todos",
  "Estrategia", 
  "Automatización",
  "Analytics",
  "Casos de Éxito",
  "Desarrollo"
]

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-32 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rotate-45 animate-bounce"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
                <div className="flex items-center space-x-2 text-purple-400 font-mono text-sm">
                  <MessageCircle className="h-4 w-4" />
                  <span className="tracking-wider uppercase font-bold">Blog</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                Domina
                <span className="block text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                  WhatsApp
                </span>
                Marketing
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300 font-medium leading-relaxed">
                Estrategias, casos de éxito y técnicas avanzadas para 
                <span className="text-emerald-400 font-bold"> convertir conversaciones en resultados</span>.
              </p>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured post */}
          <div className="mb-20">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl opacity-30 group-hover:opacity-50 blur transition-all duration-500"></div>
              
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden group-hover:-translate-y-1 transition-all duration-300">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
                        Destacado
                      </div>
                      <div className="text-slate-400 font-medium text-sm">
                        {featuredPost.category}
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-400 font-medium leading-relaxed text-lg">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center space-x-6 text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{featuredPost.readTime}</span>
                      </div>
                      <div className="font-medium">
                        Por {featuredPost.author}
                      </div>
                    </div>

                    <div className="flex items-center text-purple-400 font-bold">
                      <span>Leer artículo completo</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <article key={post.title} className="group relative">
                <div className={`absolute -inset-1 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all duration-500 bg-gradient-to-r ${post.color}`}></div>
                
                <div className="relative h-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${post.color}`}>
                          <post.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-slate-400 font-medium text-sm">
                          {post.category}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-slate-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="text-slate-500 text-sm font-medium">
                        {post.author}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-16 text-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
              Cargar Más Artículos
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}