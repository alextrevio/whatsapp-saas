'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Users, 
  Send, 
  TrendingUp, 
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Phone,
  User,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

// Métricas principales - exactamente como EventPass360
const stats = [
  {
    value: '2.8K',
    label: 'Messages Today',
    icon: MessageCircle,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    trend: '+12%'
  },
  {
    value: '847',
    label: 'Active Contacts',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    trend: '+5%'
  },
  {
    value: '94%',
    label: 'Response Rate',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    trend: '+2%'
  },
  {
    value: '15',
    label: 'Active Campaigns',
    icon: Send,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    trend: '+3'
  }
]

// Lista de contactos recientes - como EventPass360
const recentContacts = [
  {
    name: 'Maria Rodriguez',
    phone: '+52 555-0123',
    status: 'Active',
    avatar: 'MR',
    lastMessage: '2 min ago'
  },
  {
    name: 'Carlos Mendez',
    phone: '+52 555-0456',
    status: 'Pending',
    avatar: 'CM',
    lastMessage: '15 min ago'
  },
  {
    name: 'Ana Silva',
    phone: '+52 555-0789',
    status: 'Active',
    avatar: 'AS',
    lastMessage: '1 hour ago'
  },
  {
    name: 'Diego Torres',
    phone: '+52 555-0321',
    status: 'Inactive',
    avatar: 'DT',
    lastMessage: '2 hours ago'
  },
  {
    name: 'Sofia Lopez',
    phone: '+52 555-0654',
    status: 'Active',
    avatar: 'SL',
    lastMessage: '3 hours ago'
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header - minimalista como EventPass360 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Dashboard</h1>
        <p className="text-gray-600">Today's overview</p>
      </div>

      {/* Stats Grid - EXACTAMENTE como EventPass360 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              {/* Icono pequeño arriba derecha */}
              <div className="flex justify-end mb-2">
                <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              
              {/* Número GIGANTE - como EventPass360 */}
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-sm text-emerald-500 ml-2 font-medium">{stat.trend}</span>
              </div>
              
              {/* Label pequeño */}
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Card - Simple como EventPass360 */}
      <Card className="bg-white border-0 shadow-sm rounded-2xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Message Activity</h3>
            <Button variant="ghost" size="sm" className="p-0">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </Button>
          </div>
          
          {/* Gráfico simple - simulando como EventPass360 */}
          <div className="h-32 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl flex items-end justify-center p-4 mb-4">
            <div className="flex space-x-1 items-end">
              {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                <div
                  key={i}
                  className="w-6 bg-teal-400 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contactos - EXACTAMENTE como EventPass360 */}
      <Card className="bg-white border-0 shadow-sm rounded-2xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
            <Button variant="ghost" size="sm" className="text-teal-600 text-sm font-medium">
              View all
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentContacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                {/* Avatar circular - EXACTO a EventPass360 */}
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-teal-700">{contact.avatar}</span>
                </div>
                
                {/* Info del contacto */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.phone}</p>
                </div>
                
                {/* Status y tiempo */}
                <div className="text-right">
                  <div className={`inline-block w-2 h-2 rounded-full mb-1 ${
                    contact.status === 'Active' ? 'bg-emerald-400' : 
                    contact.status === 'Pending' ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}></div>
                  <p className="text-xs text-gray-500">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation - Como EventPass360 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 py-2">
            <MessageCircle className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-teal-600 font-medium">Messages</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 py-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Contacts</span>
          </Button>
          
          {/* FAB Central - EXACTO a EventPass360 */}
          <div className="relative -top-4">
            <Button size="lg" className="w-14 h-14 bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 py-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Analytics</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 py-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}