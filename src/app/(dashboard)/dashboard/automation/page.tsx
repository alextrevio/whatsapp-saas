'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Zap, 
  Plus, 
  MessageSquare, 
  Tag, 
  Clock, 
  Bot,
  Trash2,
  Edit,
  Play,
  Pause
} from 'lucide-react'

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: {
    type: string
    conditions: any
  }
  actions: Array<{
    type: string
    data: any
    delayMinutes?: number
  }>
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    triggerType: 'keyword',
    keywords: '',
    responseMessage: '',
    addTags: '',
    delayMinutes: 0
  })

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/whatsapp/automation')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.workflows || [])
      }
    } catch (error) {
      console.error('Error loading workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const createWorkflow = async () => {
    try {
      const workflow = {
        name: newWorkflow.name,
        description: newWorkflow.description,
        isActive: true,
        trigger: {
          type: newWorkflow.triggerType,
          conditions: {
            keywords: newWorkflow.keywords.split(',').map(k => k.trim()).filter(k => k)
          }
        },
        actions: [
          {
            type: 'send_message',
            data: {
              message: newWorkflow.responseMessage
            },
            delayMinutes: newWorkflow.delayMinutes
          },
          ...(newWorkflow.addTags ? [{
            type: 'add_tag',
            data: {
              tags: newWorkflow.addTags.split(',').map(t => t.trim()).filter(t => t)
            }
          }] : [])
        ]
      }

      const response = await fetch('/api/whatsapp/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      })

      if (response.ok) {
        setShowCreateForm(false)
        setNewWorkflow({
          name: '',
          description: '',
          triggerType: 'keyword',
          keywords: '',
          responseMessage: '',
          addTags: '',
          delayMinutes: 0
        })
        loadWorkflows()
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
    }
  }

  const toggleWorkflow = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/whatsapp/automation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      })

      if (response.ok) {
        loadWorkflows()
      }
    } catch (error) {
      console.error('Error toggling workflow:', error)
    }
  }

  const deleteWorkflow = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta automatización?')) {
      return
    }

    try {
      const response = await fetch(`/api/whatsapp/automation?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadWorkflows()
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  const getTriggerDescription = (workflow: AutomationWorkflow) => {
    switch (workflow.trigger.type) {
      case 'keyword':
        return `Palabras clave: ${workflow.trigger.conditions.keywords?.join(', ') || 'Ninguna'}`
      case 'first_message':
        return 'Primer mensaje del contacto'
      case 'time_delay':
        return `Después de ${workflow.trigger.conditions.delayHours || 0} horas`
      default:
        return 'Trigger desconocido'
    }
  }

  const getActionsDescription = (workflow: AutomationWorkflow) => {
    return workflow.actions.map(action => {
      switch (action.type) {
        case 'send_message':
          return `Enviar: "${action.data.message?.substring(0, 30)}..."`
        case 'add_tag':
          return `Agregar tags: ${action.data.tags?.join(', ')}`
        case 'remove_tag':
          return `Remover tags: ${action.data.tags?.join(', ')}`
        default:
          return action.type
      }
    }).join(' • ')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 animate-pulse" />
          <span>Cargando automatizaciones...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-8 w-8" />
            Automatizaciones
          </h1>
          <p className="text-muted-foreground">
            Configura respuestas automáticas y flujos de trabajo para WhatsApp
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Automatización
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{workflows.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Activas</span>
            </div>
            <p className="text-2xl font-bold">
              {workflows.filter(w => w.isActive).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Respuestas</span>
            </div>
            <p className="text-2xl font-bold">-</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Con IA</span>
            </div>
            <p className="text-2xl font-bold">
              {workflows.filter(w => w.actions.some(a => a.type === 'ai_response')).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Automatización</CardTitle>
            <CardDescription>
              Crea un flujo automático para responder a mensajes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({...prev, name: e.target.value}))}
                  placeholder="ej. Saludo Automático"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({...prev, description: e.target.value}))}
                  placeholder="Descripción breve"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Palabras Clave (separadas por comas)</Label>
              <Input
                id="keywords"
                value={newWorkflow.keywords}
                onChange={(e) => setNewWorkflow(prev => ({...prev, keywords: e.target.value}))}
                placeholder="hola, buenos días, hey, saludos"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="response">Mensaje de Respuesta</Label>
              <Textarea
                id="response"
                value={newWorkflow.responseMessage}
                onChange={(e) => setNewWorkflow(prev => ({...prev, responseMessage: e.target.value}))}
                placeholder="¡Hola! Gracias por contactarnos..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Agregar Tags (opcional)</Label>
                <Input
                  id="tags"
                  value={newWorkflow.addTags}
                  onChange={(e) => setNewWorkflow(prev => ({...prev, addTags: e.target.value}))}
                  placeholder="nuevo_lead, interesado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay">Delay en Minutos</Label>
                <Input
                  id="delay"
                  type="number"
                  value={newWorkflow.delayMinutes}
                  onChange={(e) => setNewWorkflow(prev => ({...prev, delayMinutes: parseInt(e.target.value) || 0}))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createWorkflow}>
                Crear Automatización
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay automatizaciones</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera automatización para respuestas inteligentes
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Automatización
              </Button>
            </CardContent>
          </Card>
        ) : (
          workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className={`h-5 w-5 ${workflow.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                      {workflow.name}
                    </CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked)}
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteWorkflow(workflow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-blue-600" />
                    <div>
                      <span className="text-sm font-medium">Trigger: </span>
                      <span className="text-sm text-muted-foreground">
                        {getTriggerDescription(workflow)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div>
                      <span className="text-sm font-medium">Acciones: </span>
                      <span className="text-sm text-muted-foreground">
                        {getActionsDescription(workflow)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                      {workflow.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Badge variant="outline">
                      {workflow.actions.length} acción{workflow.actions.length !== 1 ? 'es' : ''}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}