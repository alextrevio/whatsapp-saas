'use client'

import { useAuth } from '@/components/providers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle, 
  Users, 
  Send, 
  TrendingUp, 
  Activity,
  Clock
} from 'lucide-react'

const stats = [
  {
    name: 'Mensajes Enviados',
    value: '2,847',
    icon: Send,
    change: '+12%',
    changeType: 'positive' as const,
  },
  {
    name: 'Contactos Activos',
    value: '1,234',
    icon: Users,
    change: '+5%',
    changeType: 'positive' as const,
  },
  {
    name: 'Sesiones WhatsApp',
    value: '3',
    icon: MessageCircle,
    change: '+1',
    changeType: 'positive' as const,
  },
  {
    name: 'Tasa de Respuesta',
    value: '89%',
    icon: TrendingUp,
    change: '+3%',
    changeType: 'positive' as const,
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'message',
    content: 'Nuevo mensaje de +52 555-0123',
    time: '2 min ago',
    status: 'unread' as const,
  },
  {
    id: 2,
    type: 'campaign',
    content: 'Campaña "Promoción Enero" completada',
    time: '15 min ago',
    status: 'success' as const,
  },
  {
    id: 3,
    type: 'contact',
    content: '5 nuevos contactos agregados',
    time: '1 hora ago',
    status: 'info' as const,
  },
  {
    id: 4,
    type: 'session',
    content: 'Sesión WhatsApp "Ventas" conectada',
    time: '2 horas ago',
    status: 'success' as const,
  },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bienvenido de vuelta, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aquí tienes un resumen de tu actividad de WhatsApp marketing
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                    activity.status === 'unread' ? 'bg-blue-500' :
                    activity.status === 'success' ? 'bg-green-500' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.content}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                Crear Nueva Campaña
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Envía mensajes masivos
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                Agregar Contacto
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Nuevo contacto manualmente
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                Nueva Sesión WhatsApp
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Conectar número de teléfono
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                Ver Analíticas
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Métricas detalladas
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}