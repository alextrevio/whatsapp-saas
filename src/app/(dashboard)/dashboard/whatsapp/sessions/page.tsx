'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { QRModal } from '@/components/whatsapp/qr-modal'
import { Plus, Smartphone, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useAuth } from '@/components/providers'

interface WhatsAppSession {
  id: string
  session_name: string
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  phone_number?: string
  qr_code?: string
  created_at: string
}

export default function WhatsAppSessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<WhatsAppSession[]>([
    {
      id: '1',
      session_name: 'Ventas Principal',
      status: 'connected',
      phone_number: '+52 555-0123',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2', 
      session_name: 'Soporte Cliente',
      status: 'connecting',
      created_at: '2024-01-15T11:00:00Z'
    }
  ])
  
  const [showNewSession, setShowNewSession] = useState(false)
  const [newSessionName, setNewSessionName] = useState('')
  const [selectedQRSession, setSelectedQRSession] = useState<WhatsAppSession | null>(null)

  const getStatusIcon = (status: WhatsAppSession['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'connecting':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: WhatsAppSession['status']) => {
    const variants = {
      connected: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      connecting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      disconnected: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    const labels = {
      connected: 'Conectado',
      connecting: 'Conectando',
      disconnected: 'Desconectado',
      error: 'Error'
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const handleCreateSession = async () => {
    if (!newSessionName.trim() || !user) return

    const newSession: WhatsAppSession = {
      id: Date.now().toString(),
      session_name: newSessionName,
      status: 'connecting',
      created_at: new Date().toISOString()
    }

    setSessions(prev => [...prev, newSession])
    setNewSessionName('')
    setShowNewSession(false)

    // Simular proceso de conexión y mostrar QR
    setTimeout(() => {
      setSessions(prev => prev.map(session => 
        session.id === newSession.id 
          ? { ...session, qr_code: 'mock-qr-code-data' }
          : session
      ))
      
      // Abrir modal QR automáticamente
      setSelectedQRSession(newSession)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sesiones de WhatsApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tus conexiones de WhatsApp Business
          </p>
        </div>
        <Button 
          onClick={() => setShowNewSession(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sesión
        </Button>
      </div>

      {/* New Session Modal */}
      {showNewSession && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Sesión</CardTitle>
            <CardDescription>
              Dale un nombre a tu nueva sesión de WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Ej: Ventas, Soporte, Marketing..."
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
            />
            <div className="flex space-x-2">
              <Button onClick={handleCreateSession} disabled={!newSessionName.trim()}>
                Crear Sesión
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewSession(false)
                  setNewSessionName('')
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    {session.session_name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Creado: {new Date(session.created_at).toLocaleDateString('es-ES')}
                  </CardDescription>
                </div>
                {getStatusIcon(session.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estado:</span>
                {getStatusBadge(session.status)}
              </div>

              {session.phone_number && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Teléfono:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.phone_number}
                  </span>
                </div>
              )}

              {session.status === 'connecting' && session.qr_code && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escanea el código QR en tu WhatsApp
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSelectedQRSession(session)}
                  >
                    Ver Código QR
                  </Button>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={session.status === 'connecting'}
                >
                  {session.status === 'connected' ? 'Reconectar' : 'Conectar'}
                </Button>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay sesiones configuradas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Crea tu primera sesión de WhatsApp para comenzar a enviar mensajes
            </p>
            <Button onClick={() => setShowNewSession(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Sesión
            </Button>
          </CardContent>
        </Card>
      )}

      {/* QR Modal */}
      {selectedQRSession && (
        <QRModal
          sessionId={selectedQRSession.id}
          sessionName={selectedQRSession.session_name}
          isOpen={!!selectedQRSession}
          onClose={() => setSelectedQRSession(null)}
        />
      )}
    </div>
  )
}