'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Smartphone, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import QRCode from 'qrcode'

interface QRModalProps {
  sessionId: string
  sessionName: string
  isOpen: boolean
  onClose: () => void
}

interface SessionStatus {
  qr_code?: string
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  phone_number?: string
}

export function QRModal({ sessionId, sessionName, isOpen, onClose }: QRModalProps) {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    status: 'connecting'
  })
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (!isOpen) return

    // Fetch session status
    fetchSessionStatus()
    
    // Poll every 3 seconds
    const interval = setInterval(fetchSessionStatus, 3000)
    
    // Countdown for QR expiration
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchSessionStatus() // Refresh when countdown reaches 0
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    if (sessionStatus.qr_code) {
      generateQRImage(sessionStatus.qr_code)
    }
  }, [sessionStatus.qr_code])

  const fetchSessionStatus = async () => {
    try {
      const response = await fetch(`/api/whatsapp/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSessionStatus(data.session)
        
        // Close modal if connected
        if (data.session.status === 'connected') {
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Error fetching session status:', error)
    }
  }

  const generateQRImage = async (qrText: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(qrText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      setQrDataUrl(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Trigger new QR generation
      await fetch(`/api/whatsapp/sessions/${sessionId}/refresh`, {
        method: 'POST'
      })
      
      setCountdown(60)
      await fetchSessionStatus()
    } catch (error) {
      console.error('Error refreshing QR:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    const variants = {
      connecting: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Conectando' },
      connected: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Conectado' },
      disconnected: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300', label: 'Desconectado' },
      error: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Error' }
    }

    const variant = variants[sessionStatus.status]
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  const getStatusIcon = () => {
    switch (sessionStatus.status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Smartphone className="h-5 w-5 text-blue-500" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                {getStatusIcon()}
                <span className="ml-2">{sessionName}</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {sessionStatus.status === 'connected' 
                  ? `Conectado como ${sessionStatus.phone_number}`
                  : 'Escanea el código QR con WhatsApp'
                }
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {sessionStatus.status === 'connected' ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                ¡Conectado Exitosamente!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu sesión de WhatsApp está lista para usar
              </p>
              <p className="text-sm text-green-600 font-medium mt-2">
                {sessionStatus.phone_number}
              </p>
            </div>
          ) : sessionStatus.qr_code && qrDataUrl ? (
            <>
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <img 
                    src={qrDataUrl} 
                    alt="QR Code" 
                    className="w-64 h-64"
                  />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1. Abre WhatsApp en tu teléfono
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2. Ve a Configuración → Dispositivos vinculados
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3. Toca "Vincular un dispositivo" y escanea este código
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Código expira en: {countdown}s
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Renovar
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Generando código QR...
              </p>
            </div>
          )}

          {sessionStatus.status === 'error' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  Error al conectar. Intenta crear una nueva sesión.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}