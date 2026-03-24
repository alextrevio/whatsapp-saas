'use client'

// Sin provider de autenticación para herramienta interna
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Users, 
  Send, 
  TrendingUp, 
  Activity,
  Clock,
  Bot,
  Zap,
  BarChart3,
  Plus,
  ArrowRight,
  Sparkles,
  Target,
  MessageSquare,
  Settings,
  Smartphone,
  Globe,
  Orbit,
  Flame,
  Rocket,
  Crown,
  Star,
  Hexagon,
  Circle,
  Triangle
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: 'Mensajes Enviados',
    value: '2,847',
    icon: Send,
    change: '+12%',
    changeType: 'positive' as const,
    description: 'Últimos 30 días'
  },
  {
    name: 'Contactos Activos',
    value: '1,234',
    icon: Users,
    change: '+5%',
    changeType: 'positive' as const,
    description: 'En tu CRM'
  },
  {
    name: 'Sesiones WhatsApp',
    value: '3',
    icon: MessageCircle,
    change: '+1',
    changeType: 'positive' as const,
    description: 'Números conectados'
  },
  {
    name: 'Tasa de Respuesta',
    value: '89%',
    icon: TrendingUp,
    change: '+3%',
    changeType: 'positive' as const,
    description: 'Media del mes'
  },
]

const quickActions = [
  {
    title: 'Crear Nueva Sesión WhatsApp',
    description: 'Conecta un nuevo número de WhatsApp',
    icon: Smartphone,
    href: '/dashboard/whatsapp/sessions',
    color: 'bg-emerald-500',
    featured: true
  },
  {
    title: 'Configurar Bot IA',
    description: 'Automatiza respuestas con GPT-4',
    icon: Bot,
    href: '/dashboard/whatsapp/bots',
    color: 'bg-blue-500',
    featured: true
  },
  {
    title: 'Nueva Automatización',
    description: 'Crea flujos automáticos',
    icon: Zap,
    href: '/dashboard/automation',
    color: 'bg-purple-500'
  },
  {
    title: 'Agregar Contactos',
    description: 'Importa o crea contactos',
    icon: Users,
    href: '/dashboard/contacts',
    color: 'bg-orange-500'
  },
  {
    title: 'Ver Inbox',
    description: 'Gestiona conversaciones',
    icon: MessageSquare,
    href: '/dashboard/whatsapp/inbox',
    color: 'bg-indigo-500'
  },
  {
    title: 'Analíticas',
    description: 'Métricas detalladas',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'bg-pink-500'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'message',
    title: 'Nuevo mensaje recibido',
    content: 'De: +52 555-0123 - "Hola, necesito información..."',
    time: '2 min',
    status: 'unread' as const,
    icon: MessageCircle
  },
  {
    id: 2,
    type: 'bot',
    title: 'Bot IA activado',
    content: 'Bot "Ventas Pro" respondió automáticamente',
    time: '5 min',
    status: 'success' as const,
    icon: Bot
  },
  {
    id: 3,
    type: 'automation',
    title: 'Automatización ejecutada',
    content: 'Flujo "Saludo Inicial" enviado a 15 contactos',
    time: '15 min',
    status: 'success' as const,
    icon: Zap
  },
  {
    id: 4,
    type: 'contact',
    title: 'Nuevos contactos',
    content: '8 contactos agregados automáticamente',
    time: '1 hora',
    status: 'info' as const,
    icon: Users
  },
  {
    id: 5,
    type: 'session',
    title: 'Sesión WhatsApp',
    content: 'Número +52-XXX-XXXX conectado exitosamente',
    time: '2 horas',
    status: 'success' as const,
    icon: Globe
  },
]

export default function DashboardPage() {
  // Sin autenticación para herramienta interna
  const userName = 'Alejandro'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Floating geometric background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rotate-12 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-10 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rotate-45 animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 space-y-12 max-w-7xl mx-auto p-6">
        {/* Hero Header - Neo-brutalist inspired */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 shadow-2xl border-4 border-slate-800">
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
          </div>
          
          {/* Geometric shapes */}
          <div className="absolute top-8 right-8">
            <div className="relative">
              <Hexagon className="w-16 h-16 text-blue-400/30 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Circle className="w-8 h-8 text-emerald-400/50 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8">
            <Triangle className="w-12 h-12 text-purple-400/30 animate-bounce" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg animate-pulse">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-emerald-400 font-mono text-sm tracking-wider uppercase">
                    // Command Center Online
                  </div>
                </div>
                
                <div>
                  <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                    Hey {userName}! 🚀
                  </h1>
                  <p className="text-xl text-slate-300 font-medium leading-relaxed">
                    Tu imperio digital de WhatsApp está <span className="text-emerald-400 font-bold">activo</span>
                  </p>
                </div>
                
                <div className="flex items-center space-x-6 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="font-mono text-sm">Sistema operativo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    <span className="font-mono text-sm">IA conectada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                    <span className="font-mono text-sm">Automatizaciones activas</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                    <div className="relative">
                      <Orbit className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '10s' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Cyberpunk brutalist cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.name} className="group relative">
              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-2xl opacity-30 group-hover:opacity-60 blur transition-all duration-500 ${
                index === 0 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                index === 1 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                index === 2 ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                'bg-gradient-to-r from-orange-400 to-red-400'
              }`}></div>
              
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className={`p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300 ${
                        index === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                        index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                        'bg-gradient-to-br from-orange-500 to-red-600'
                      }`}>
                        <stat.icon className="h-7 w-7 text-white" />
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-xl font-bold text-sm border-2 ${
                        stat.changeType === 'positive' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {stat.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {stat.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse ${
                    index === 0 ? 'bg-emerald-400' :
                    index === 1 ? 'bg-blue-400' :
                    index === 2 ? 'bg-purple-400' :
                    'bg-orange-400'
                  }`}></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick Actions - Gaming-inspired action cards */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Power Moves
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Acelera tu workflow</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="font-bold border-2 hover:bg-purple-50 hover:border-purple-300">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <div className="group relative">
                  {/* Featured item special treatment */}
                  {action.featured && (
                    <>
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-3xl opacity-40 group-hover:opacity-70 blur transition-all duration-500"></div>
                      <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 z-20">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm px-4 py-2 rounded-xl font-bold shadow-xl border-2 border-white flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          TOP
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Card className={`relative h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 ${
                    action.featured 
                      ? 'border-emerald-200 dark:border-emerald-800' 
                      : 'border-slate-200 dark:border-slate-700'
                  } rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group-hover:-translate-y-2`}>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                          <div className={`p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${action.color}`}>
                            <action.icon className="h-8 w-8 text-white" />
                          </div>
                          
                          {action.featured && (
                            <div className="flex space-x-1">
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-blue-500 group-hover:bg-clip-text transition-all duration-300">
                            {action.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                            <Flame className="mr-2 h-4 w-4" />
                            ACTIVAR
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                      
                      {/* Action card decorations */}
                      <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity delay-100"></div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - Enhanced */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg mr-3">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                Actividad Reciente
              </div>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                Ver todo
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'unread' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.status === 'unread' ? 'text-blue-600' :
                      activity.status === 'success' ? 'text-green-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {activity.title}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        hace {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {activity.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <Target className="h-5 w-5 text-white" />
              </div>
              Rendimiento Hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mensajes enviados</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">147</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Respuestas bot IA</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">89</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Leads generados</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">23</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full group">
                  Ver análisis completo
                  <BarChart3 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Epic CTA Section - Gaming boss battle style */}
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%),radial-gradient(circle_at_40%_80%,rgba(120,255,198,0.3),transparent_50%)]"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-purple-400 rounded-full animate-ping delay-500"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-700"></div>
          </div>
          
          <Card className="relative bg-transparent border-4 border-white/20 rounded-3xl shadow-2xl backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl animate-bounce">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-emerald-400 font-mono text-sm tracking-wider uppercase">
                      // Final Boss Battle
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tight">
                    ¡Desata el <span className="text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text">PODER TOTAL</span>!
                  </h3>
                  <p className="text-xl text-slate-300 font-medium leading-relaxed">
                    Configura tu primer bot IA en <span className="text-emerald-400 font-bold">menos de 5 minutos</span> y convierte cada conversación en una máquina de resultados
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/dashboard/whatsapp/bots">
                    <Button size="lg" className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl border-2 border-emerald-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center">
                        <Bot className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                        Configurar Bot IA
                        <Zap className="ml-3 h-5 w-5 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/dashboard/whatsapp/sessions">
                    <Button size="lg" className="group bg-transparent border-3 border-white text-white hover:bg-white hover:text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center">
                        <Smartphone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                        Conectar WhatsApp
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-8 text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-mono text-sm">Premium AI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      <span className="font-mono text-sm">Tiempo real</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="font-mono text-sm">Sin límites</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}