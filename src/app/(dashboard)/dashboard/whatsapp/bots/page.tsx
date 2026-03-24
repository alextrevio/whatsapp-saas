'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bot, MessageCircle, Settings, Zap, Activity } from 'lucide-react'

interface BotPersonality {
  id: string
  name: string
  description: string
}

interface BotStatus {
  enabled: boolean
  personality: string
}

export default function WhatsAppBotsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [botStatuses, setBotStatuses] = useState<Map<string, BotStatus>>(new Map())
  const [personalities, setPersonalities] = useState<BotPersonality[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Cargar sesiones WhatsApp
      const sessionsResponse = await fetch('/api/whatsapp/sessions')
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setSessions(sessionsData.sessions || [])

        // Cargar status de bots para cada sesión
        const statusMap = new Map<string, BotStatus>()
        const personalitiesSet = new Set<BotPersonality>()

        for (const session of sessionsData.sessions || []) {
          const botResponse = await fetch(`/api/whatsapp/bot?sessionId=${session.id}`)
          if (botResponse.ok) {
            const botData = await botResponse.json()
            statusMap.set(session.id, botData.botStatus)
            
            // Agregar personalidades disponibles
            botData.availablePersonalities?.forEach((p: BotPersonality) => {
              personalitiesSet.add(p)
            })
          }
        }

        setBotStatuses(statusMap)
        setPersonalities(Array.from(personalitiesSet))
      }
    } catch (error) {
      console.error('Error loading bot data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBot = async (sessionId: string, enabled: boolean, personalityId?: string) => {
    try {
      const response = await fetch('/api/whatsapp/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: enabled ? 'enable' : 'disable',
          personalityId: personalityId || 'friendly'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBotStatuses(prev => new Map(prev.set(sessionId, data.botStatus)))
      }
    } catch (error) {
      console.error('Error toggling bot:', error)
    }
  }

  const changePersonality = async (sessionId: string, personalityId: string) => {
    await toggleBot(sessionId, true, personalityId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 animate-spin" />
          <span>Cargando bots...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-8 w-8" />
            Bots IA WhatsApp
          </h1>
          <p className="text-muted-foreground">
            Configura respuestas automáticas inteligentes para tus sesiones WhatsApp
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Sesiones</span>
            </div>
            <p className="text-2xl font-bold">{sessions.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Bots Activos</span>
            </div>
            <p className="text-2xl font-bold">
              {Array.from(botStatuses.values()).filter(s => s.enabled).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Personalidades</span>
            </div>
            <p className="text-2xl font-bold">{personalities.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Respuestas Hoy</span>
            </div>
            <p className="text-2xl font-bold">-</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Configuración por Sesión</h2>
        
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay sesiones WhatsApp</h3>
              <p className="text-muted-foreground mb-4">
                Crea una sesión WhatsApp primero para configurar bots IA
              </p>
              <Button onClick={() => window.location.href = '/dashboard/whatsapp/sessions'}>
                Ir a Sesiones
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => {
            const botStatus = botStatuses.get(session.id)
            return (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        {session.session_name || session.name || `Sesión ${session.id.slice(-4)}`}
                      </CardTitle>
                      <CardDescription>
                        {session.phone_number || 'No conectado'} • 
                        <Badge 
                          variant={session.status === 'connected' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {session.status}
                        </Badge>
                      </CardDescription>
                    </div>
                    
                    <Switch
                      checked={botStatus?.enabled || false}
                      onCheckedChange={(enabled) => toggleBot(session.id, enabled)}
                      disabled={session.status !== 'connected'}
                    />
                  </div>
                </CardHeader>
                
                {botStatus?.enabled && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Bot className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Bot IA Activo</span>
                        <Badge variant="outline" className="ml-auto">
                          {personalities.find(p => p.id === botStatus.personality)?.name || 'Personalidad no encontrada'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Personalidad del Bot:</label>
                        <Select
                          value={botStatus.personality}
                          onValueChange={(value) => changePersonality(session.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {personalities.map((personality) => (
                              <SelectItem key={personality.id} value={personality.id}>
                                <div>
                                  <div className="font-medium">{personality.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {personality.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                        <strong>Funciones activas:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>• Respuestas automáticas inteligentes</li>
                          <li>• Detección de intención del usuario</li>
                          <li>• Escalado a humano cuando se solicite</li>
                          <li>• Scoring automático de leads</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>

      {/* Personalities Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personalidades Disponibles</CardTitle>
          <CardDescription>
            Cada personalidad está entrenada para diferentes objetivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {personalities.map((personality) => (
              <div 
                key={personality.id}
                className="flex items-start gap-3 p-3 border rounded-md"
              >
                <Bot className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{personality.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {personality.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}