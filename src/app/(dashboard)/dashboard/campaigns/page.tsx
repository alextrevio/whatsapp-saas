'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Send, 
  Users, 
  Calendar,
  Play,
  Pause,
  MoreVertical,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Campaign {
  id: string
  name: string
  message: string
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused'
  totalContacts: number
  sentCount: number
  deliveredCount: number
  readCount: number
  scheduledAt?: string
  createdAt: string
  tags: string[]
}

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Promoción Enero 2024',
      message: '🎉 ¡Oferta especial! 50% de descuento en todos nuestros productos...',
      status: 'completed',
      totalContacts: 1250,
      sentCount: 1250,
      deliveredCount: 1180,
      readCount: 950,
      createdAt: '2024-01-15T09:00:00Z',
      tags: ['promocion', 'descuento']
    },
    {
      id: '2',
      name: 'Seguimiento Clientes VIP',
      message: 'Estimado cliente VIP, queremos conocer tu experiencia...',
      status: 'running',
      totalContacts: 85,
      sentCount: 45,
      deliveredCount: 42,
      readCount: 38,
      createdAt: '2024-01-20T14:30:00Z',
      tags: ['vip', 'seguimiento']
    },
    {
      id: '3',
      name: 'Lanzamiento Producto Nuevo',
      message: '📱 ¡Nuevo producto disponible! Sé el primero en conocer...',
      status: 'scheduled',
      totalContacts: 520,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      scheduledAt: '2024-01-25T10:00:00Z',
      createdAt: '2024-01-22T16:15:00Z',
      tags: ['lanzamiento', 'producto']
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      running: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      paused: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }

    const labels = {
      draft: 'Borrador',
      scheduled: 'Programada',
      running: 'Ejecutándose',
      completed: 'Completada',
      paused: 'Pausada'
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'running':
        return <Play className="h-4 w-4 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getDeliveryRate = (campaign: Campaign) => {
    if (campaign.sentCount === 0) return 0
    return Math.round((campaign.deliveredCount / campaign.sentCount) * 100)
  }

  const getReadRate = (campaign: Campaign) => {
    if (campaign.deliveredCount === 0) return 0
    return Math.round((campaign.readCount / campaign.deliveredCount) * 100)
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === '' || campaign.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Campañas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tus campañas de mensajes masivos
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Campañas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Activas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns.filter(c => c.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Mensajes Enviados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns.reduce((sum, c) => sum + c.sentCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tasa Promedio
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((sum, c) => sum + getDeliveryRate(c), 0) / campaigns.length)
                    : 0
                  }%
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
                placeholder="Buscar campañas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
            >
              <option value="">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="scheduled">Programada</option>
              <option value="running">Ejecutándose</option>
              <option value="completed">Completada</option>
              <option value="paused">Pausada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(campaign.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {campaign.name}
                      </h3>
                      {getStatusBadge(campaign.status)}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {campaign.message}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {campaign.totalContacts.toLocaleString()} contactos
                      </div>
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-1" />
                        {campaign.sentCount.toLocaleString()} enviados
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {getDeliveryRate(campaign)}% entregados
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {getReadRate(campaign)}% leídos
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 mt-3">
                      {campaign.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Creada: {formatDate(campaign.createdAt)}
                      {campaign.scheduledAt && (
                        <span className="ml-4">
                          Programada: {formatDate(campaign.scheduledAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {campaign.status === 'running' && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {campaign.status === 'paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {campaign.status === 'running' && campaign.sentCount > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progreso</span>
                    <span>
                      {campaign.sentCount} / {campaign.totalContacts} 
                      ({Math.round((campaign.sentCount / campaign.totalContacts) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((campaign.sentCount / campaign.totalContacts) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Send className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay campañas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || statusFilter 
                  ? 'No se encontraron campañas con los filtros aplicados'
                  : 'Crea tu primera campaña para comenzar a enviar mensajes masivos'
                }
              </p>
              <Button asChild>
                <Link href="/dashboard/campaigns/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}