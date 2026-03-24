'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  Plus, 
  Users, 
  MessageSquare,
  Send,
  Smartphone,
  Activity,
  Settings,
  BarChart3,
  Crown,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { AgencyStats, SubAccountUsage } from '@/lib/multi-tenant'

export default function AgencyPage() {
  const [currentPlan] = useState('enterprise') // Mock plan
  const [stats, setStats] = useState<AgencyStats>({
    totalSubAccounts: 12,
    activeSubAccounts: 10,
    totalContacts: 15420,
    totalMessages: 89350,
    totalCampaigns: 145,
    activeSessions: 8
  })

  const [subAccounts, setSubAccounts] = useState<SubAccountUsage[]>([
    {
      subAccount: {
        id: '1',
        organization_id: 'org1',
        name: 'Cliente Premium Corp',
        description: 'Cliente principal de e-commerce',
        is_active: true,
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-20T14:30:00Z'
      },
      contacts: 2450,
      messages: 12350,
      campaigns: 25,
      sessions: 3,
      lastActivity: '2024-01-23T10:30:00Z'
    },
    {
      subAccount: {
        id: '2',
        organization_id: 'org1',
        name: 'Restaurante Los Sabores',
        description: 'Cadena de restaurantes - delivery',
        is_active: true,
        created_at: '2024-01-12T11:00:00Z',
        updated_at: '2024-01-22T16:45:00Z'
      },
      contacts: 1850,
      messages: 8900,
      campaigns: 18,
      sessions: 2,
      lastActivity: '2024-01-23T15:20:00Z'
    },
    {
      subAccount: {
        id: '3',
        organization_id: 'org1',
        name: 'Inmobiliaria ModernHomes',
        description: 'Venta y renta de propiedades',
        is_active: true,
        created_at: '2024-01-15T14:20:00Z',
        updated_at: '2024-01-23T09:15:00Z'
      },
      contacts: 920,
      messages: 4200,
      campaigns: 8,
      sessions: 1,
      lastActivity: '2024-01-22T18:45:00Z'
    },
    {
      subAccount: {
        id: '4',
        organization_id: 'org1',
        name: 'Fitness Center Elite',
        description: 'Gimnasio y centro de bienestar',
        is_active: false,
        created_at: '2024-01-05T08:30:00Z',
        updated_at: '2024-01-18T12:00:00Z'
      },
      contacts: 650,
      messages: 2100,
      campaigns: 5,
      sessions: 0,
      lastActivity: '2024-01-18T12:00:00Z'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const hasAgencyAccess = ['pro', 'enterprise'].includes(currentPlan)

  const filteredSubAccounts = subAccounts.filter(usage => {
    const matchesSearch = searchQuery === '' || 
      usage.subAccount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (usage.subAccount.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && usage.subAccount.is_active) ||
      (statusFilter === 'inactive' && !usage.subAccount.is_active)
    
    return matchesSearch && matchesStatus
  })

  const getUsagePercentage = (used: number, total: number): number => {
    if (total === 0) return 0
    return (used / total) * 100
  }

  const getActivityColor = (lastActivity?: string): string => {
    if (!lastActivity) return 'text-gray-400'
    
    const now = new Date()
    const activity = new Date(lastActivity)
    const hoursAgo = (now.getTime() - activity.getTime()) / (1000 * 60 * 60)
    
    if (hoursAgo < 24) return 'text-green-500'
    if (hoursAgo < 72) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (!hasAgencyAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard de Agencia
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra múltiples cuentas de clientes desde un solo lugar
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Funciones de Agencia Disponibles en Pro y Enterprise
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Actualiza tu plan para gestionar múltiples sub-cuentas y clientes
            </p>
            <Button>
              Ver Planes y Precios
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard de Agencia
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra todas las cuentas de tus clientes
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sub-cuenta
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sub-cuentas
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.activeSubAccounts}/{stats.totalSubAccounts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Contactos
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalContacts.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Mensajes
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalMessages.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Campañas
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCampaigns}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Smartphone className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sesiones Activas
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.activeSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Eficiencia
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  94%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar sub-cuentas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-accounts List */}
      <div className="space-y-4">
        {filteredSubAccounts.map((usage) => (
          <Card key={usage.subAccount.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`mt-1 h-3 w-3 rounded-full ${
                    usage.subAccount.is_active ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {usage.subAccount.name}
                      </h3>
                      <Badge
                        className={
                          usage.subAccount.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }
                      >
                        {usage.subAccount.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>

                    {usage.subAccount.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {usage.subAccount.description}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Contactos</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {usage.contacts.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Mensajes</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {usage.messages.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Campañas</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {usage.campaigns}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Sesiones</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {usage.sessions}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Última Actividad</p>
                        <p className={`text-sm font-medium ${getActivityColor(usage.lastActivity)}`}>
                          {usage.lastActivity 
                            ? formatDate(usage.lastActivity)
                            : 'Nunca'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Activity Progress */}
                    {usage.messages > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Actividad del mes</span>
                          <span>{Math.round(getUsagePercentage(usage.messages, stats.totalMessages))}% del total</span>
                        </div>
                        <Progress 
                          value={getUsagePercentage(usage.messages, stats.totalMessages)} 
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      Creada: {formatDate(usage.subAccount.created_at)}
                      <span className="mx-2">•</span>
                      Actualizada: {formatDate(usage.subAccount.updated_at)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/agency/${usage.subAccount.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSubAccounts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery || statusFilter 
                  ? 'No se encontraron sub-cuentas'
                  : 'No hay sub-cuentas configuradas'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || statusFilter 
                  ? 'Prueba con diferentes filtros de búsqueda'
                  : 'Crea tu primera sub-cuenta para comenzar a gestionar clientes'
                }
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Sub-cuenta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <Card className="fixed inset-x-0 top-20 max-w-md mx-auto z-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Crear Nueva Sub-cuenta</CardTitle>
            <CardDescription>
              Configura una nueva cuenta para tu cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del Cliente</label>
              <Input placeholder="Ej: Restaurante Los Sabores" />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Input placeholder="Breve descripción del negocio" />
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1">Crear Sub-cuenta</Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlay for modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}