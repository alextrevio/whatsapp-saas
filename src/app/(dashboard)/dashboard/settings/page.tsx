'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Settings, Key, Webhook } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = async (section: string) => {
    setLoading(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administra la configuración de tu plataforma WhatsApp
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Tu nombre"
                    defaultValue="Alejandro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Tu apellido"
                    defaultValue="Treviño"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="tu@email.com"
                />
              </div>
              <Button 
                onClick={() => handleSave('profile')}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración WhatsApp</CardTitle>
              <CardDescription>
                Configura los parámetros de WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sesión (minutos)</Label>
                <Input 
                  id="sessionTimeout" 
                  type="number"
                  placeholder="30"
                  defaultValue="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messageDelay">Delay entre mensajes (segundos)</Label>
                <Input 
                  id="messageDelay" 
                  type="number"
                  placeholder="2"
                  defaultValue="2"
                />
              </div>
              <Button 
                onClick={() => handleSave('whatsapp')}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración API</CardTitle>
              <CardDescription>
                Para integraciones internas y automaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Token de API Interno</Label>
                <div className="flex gap-2">
                  <Input 
                    readOnly
                    value="at_internal_************************"
                    className="font-mono"
                  />
                  <Button variant="outline">Regenerar</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Usa este token para integraciones internas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configura las notificaciones del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailNotifications">Email de Notificaciones</Label>
                <Input 
                  id="emailNotifications" 
                  type="email"
                  placeholder="notificaciones@tudominio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL (opcional)</Label>
                <Input 
                  id="webhookUrl" 
                  type="url"
                  placeholder="https://tu-sistema.com/webhook"
                />
              </div>
              <Button 
                onClick={() => handleSave('notifications')}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Notificaciones'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}