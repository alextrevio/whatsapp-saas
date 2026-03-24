'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function SimpleLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      console.log('🚀 Starting login process...')

      // Llamar directamente a la API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('📊 Login response:', data)

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || 'Error en el login',
          details: data
        })
        return
      }

      setResult({
        success: true,
        message: 'Login exitoso',
        data
      })

      // Redirigir después de 1 segundo
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (error: any) {
      console.error('❌ Login error:', error)
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
              Login Simple
            </CardTitle>
            <p className="text-gray-600">
              Sistema simplificado de autenticación
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-blue-600">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <a href="/simple-register" className="text-emerald-600 hover:underline">
                  Regístrate aquí
                </a>
              </p>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-700 font-medium">
                  💡 Cuentas de prueba
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Registra una nueva cuenta o usa cualquier email/contraseña que ya registraste
                </p>
              </div>
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

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-yellow-800">🔧 Navegación</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700">
              <a href="/register" className="hover:underline">• Registro Original</a>
              <a href="/login" className="hover:underline">• Login Original</a>
              <a href="/simple-register" className="hover:underline">• Registro Simple</a>
              <a href="/simple-login" className="hover:underline">• Login Simple</a>
              <a href="/debug-auth" className="hover:underline">• Debug Auth</a>
              <a href="/api/health" className="hover:underline">• Health Check</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}