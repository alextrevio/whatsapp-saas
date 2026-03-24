'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Code,
  AlertCircle,
  CheckCircle,
  Calendar,
  Activity
} from 'lucide-react'
import { API_PERMISSIONS, type ApiPermission, type ApiKey } from '@/lib/api-keys'
import { formatDate } from '@/lib/utils'

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newApiKey, setNewApiKey] = useState<{
    name: string
    permissions: ApiPermission[]
    expiresInDays?: number
  }>({
    name: '',
    permissions: [],
    expiresInDays: undefined
  })

  const [createdKey, setCreatedKey] = useState<{
    key: string
    name: string
  } | null>(null)

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      // En implementación real, cargarías desde la API
      const mockApiKeys: ApiKey[] = [
        {
          id: '1',
          organization_id: 'org1',
          name: 'Producción API',
          key: 'hashed_key_1',
          prefix: 'wsp',
          permissions: ['contacts:read', 'contacts:write', 'messages:send'],
          last_used_at: '2024-01-20T10:30:00Z',
          is_active: true,
          created_at: '2024-01-15T09:00:00Z',
          updated_at: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          organization_id: 'org1',
          name: 'Desarrollo',
          key: 'hashed_key_2', 
          prefix: 'wsp',
          permissions: ['contacts:read', 'messages:read'],
          expires_at: '2024-12-31T23:59:59Z',
          is_active: true,
          created_at: '2024-01-10T14:20:00Z',
          updated_at: '2024-01-10T14:20:00Z'
        }
      ]
      
      setApiKeys(mockApiKeys)
    } catch (error) {
      console.error('Error loading API keys:', error)
    }
  }

  const handleCreateApiKey = async () => {
    if (!newApiKey.name.trim() || newApiKey.permissions.length === 0) {
      return
    }

    setLoading(true)
    try {
      // En implementación real, llamarías a tu API
      console.log('Creating API key:', newApiKey)
      
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockCreatedKey = {
        key: `wsp_${Math.random().toString(36).substring(2, 50)}`,
        name: newApiKey.name
      }
      
      setCreatedKey(mockCreatedKey)
      setNewApiKey({ name: '', permissions: [], expiresInDays: undefined })
      setShowCreateModal(false)
      
      // Recargar lista
      loadApiKeys()
      
    } catch (error) {
      console.error('Error creating API key:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeApiKey = async (apiKeyId: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres revocar la API key "${name}"?`)) {
      return
    }

    try {
      // En implementación real, llamarías a tu API
      console.log('Revoking API key:', apiKeyId)
      
      setApiKeys(prev => prev.map(key => 
        key.id === apiKeyId ? { ...key, is_active: false } : key
      ))
      
    } catch (error) {
      console.error('Error revoking API key:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // En implementación real, mostrarías un toast
    console.log('Copied to clipboard:', text)
  }

  const getPermissionBadgeColor = (permission: ApiPermission): string => {
    if (permission.includes('write') || permission.includes('delete')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    if (permission.includes('read')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  const isExpiringSoon = (expiresAt?: string): boolean => {
    if (!expiresAt) return false
    const expiry = new Date(expiresAt)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            API Keys
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tus claves de API para integraciones externas
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva API Key
        </Button>
      </div>

      {/* API Documentation Link */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Documentación de la API
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consulta nuestra documentación completa para integrar la API
                </p>
              </div>
            </div>
            <Button variant="outline">
              Ver Documentación
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Created Key Modal */}
      {createdKey && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800 dark:text-green-300">
              <CheckCircle className="h-5 w-5 mr-2" />
              API Key Creada: {createdKey.name}
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-400">
              Guarda esta clave en un lugar seguro. No podrás verla de nuevo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tu nueva API Key</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  value={createdKey.key}
                  readOnly
                  className="font-mono text-sm bg-white dark:bg-gray-800"
                />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(createdKey.key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setCreatedKey(null)}
              className="w-full"
            >
              Entendido, he guardado la clave
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva API Key</CardTitle>
            <CardDescription>
              Configura los permisos y opciones para tu nueva API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyName">Nombre de la API Key</Label>
              <Input
                id="keyName"
                value={newApiKey.name}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mi integración de producción"
              />
            </div>

            <div>
              <Label htmlFor="expiresInDays">Expiración (opcional)</Label>
              <Input
                id="expiresInDays"
                type="number"
                value={newApiKey.expiresInDays || ''}
                onChange={(e) => setNewApiKey(prev => ({ 
                  ...prev, 
                  expiresInDays: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="365 (días)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Déjalo vacío para que nunca expire
              </p>
            </div>

            <div>
              <Label>Permisos</Label>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(API_PERMISSIONS).map(([permission, description]) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={newApiKey.permissions.includes(permission as ApiPermission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewApiKey(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission as ApiPermission]
                          }))
                        } else {
                          setNewApiKey(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission)
                          }))
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={permission} className="text-sm">
                      <span className="font-mono text-xs">{permission}</span>
                      <span className="text-gray-500 ml-2">{description}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateApiKey}
                disabled={loading || !newApiKey.name.trim() || newApiKey.permissions.length === 0}
                className="flex-1"
              >
                {loading ? 'Creando...' : 'Crear API Key'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {apiKey.name}
                    </h3>
                    
                    {!apiKey.is_active ? (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Revocada
                      </Badge>
                    ) : apiKey.expires_at && isExpiringSoon(apiKey.expires_at) ? (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Expirando Pronto
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Activa
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-mono">{apiKey.prefix}_***************************</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${apiKey.prefix}_***************************`)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map(permission => (
                      <Badge 
                        key={permission} 
                        className={getPermissionBadgeColor(permission)}
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Creada</p>
                      <p className="font-medium">
                        {formatDate(apiKey.created_at)}
                      </p>
                    </div>
                    
                    {apiKey.last_used_at && (
                      <div>
                        <p className="text-gray-500">Último uso</p>
                        <p className="font-medium">
                          {formatDate(apiKey.last_used_at)}
                        </p>
                      </div>
                    )}

                    {apiKey.expires_at && (
                      <div>
                        <p className="text-gray-500">Expira</p>
                        <p className={`font-medium ${
                          isExpiringSoon(apiKey.expires_at) ? 'text-yellow-600' : ''
                        }`}>
                          {formatDate(apiKey.expires_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {apiKey.is_active && (
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRevokeApiKey(apiKey.id, apiKey.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {apiKeys.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Key className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay API keys configuradas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Crea tu primera API key para comenzar a integrar con sistemas externos
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Uso</CardTitle>
          <CardDescription>
            Ejemplos de cómo usar la API con diferentes lenguajes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">cURL</h4>
            <Textarea
              value={`curl -X POST https://api.whatsappsaas.com/v1/messages/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+5255512345678",
    "message": "Hola desde la API!"
  }'`}
              readOnly
              className="font-mono text-sm"
              rows={6}
            />
          </div>

          <div>
            <h4 className="font-medium mb-2">JavaScript</h4>
            <Textarea
              value={`const response = await fetch('https://api.whatsappsaas.com/v1/messages/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+5255512345678',
    message: 'Hola desde JavaScript!'
  })
});

const result = await response.json();`}
              readOnly
              className="font-mono text-sm"
              rows={10}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}