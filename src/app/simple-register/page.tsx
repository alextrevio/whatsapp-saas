'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function SimpleRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: 'Mi Organización',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      console.log('🚀 Starting registration process...')

      // Llamar directamente a la API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('📊 Registration response:', data)

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || 'Error en el registro',
          details: data
        })
        return
      }

      setResult({
        success: true,
        message: 'Cuenta creada exitosamente',
        data
      })

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error: any) {
      console.error('❌ Registration error:', error)
      setResult({
        success: false,
        error: 'Error de conexión: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-8">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Registro Simple
            </CardTitle>
            <p className="text-gray-600">
              Sistema simplificado sin middleware
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Nombre de tu organización"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-blue-600">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <a href="/simple-login" className="text-emerald-600 hover:underline">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.success ? (
                <div>
                  <strong>¡Éxito!</strong><br/>
                  {result.message}<br/>
                  Redirigiendo al dashboard...
                </div>
              ) : (
                <div>
                  <strong>Error:</strong><br/>
                  {result.error}
                  {result.details && (
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-blue-800">🧪 Sistema de Prueba</h3>
            <p className="text-sm text-blue-700 mb-3">
              Este es un sistema de registro alternativo que bypasea el middleware complejo y usa APIs directas.
            </p>
            <div className="space-y-1 text-xs text-blue-600">
              <div>• <a href="/simple-register" className="hover:underline">Registro Simple</a></div>
              <div>• <a href="/simple-login" className="hover:underline">Login Simple</a></div>
              <div>• <a href="/api/health" className="hover:underline">Health Check</a></div>
              <div>• <a href="/debug-auth" className="hover:underline">Debug Completo</a></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}