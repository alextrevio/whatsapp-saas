'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function TestRegisterPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: 'Test Org',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      console.log('🚀 Iniciando registro con:', { email: formData.email })
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            organization_name: formData.organizationName,
          },
        },
      })

      console.log('📊 Resultado de signUp:', { data, error })

      if (error) {
        setResult({
          success: false,
          error: error.message,
          code: error.status,
          details: error
        })
      } else {
        setResult({
          success: true,
          user: data.user,
          session: data.session,
          needsConfirmation: !data.session
        })
      }
    } catch (error: any) {
      console.error('❌ Error en registro:', error)
      setResult({
        success: false,
        error: error.message,
        stack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      setResult({
        connectionTest: true,
        success: !error,
        error: error?.message,
        data
      })
    } catch (error: any) {
      setResult({
        connectionTest: true,
        success: false,
        error: error.message
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test de Registro Simplificado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} variant="outline">
              🔍 Test Conexión a Supabase
            </Button>

            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Input
                type="text"
                placeholder="Nombre de organización"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                required
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creando cuenta...' : '🚀 Crear Cuenta de Prueba'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
              
              {result.success && result.needsConfirmation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ✅ <strong>Registro exitoso!</strong><br/>
                    📧 Revisa tu email para confirmar la cuenta<br/>
                    🔗 O continúa sin confirmación según la configuración de Supabase
                  </p>
                </div>
              )}

              {result.success && !result.needsConfirmation && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    🎉 <strong>¡Registro y login exitoso!</strong><br/>
                    ✅ Usuario creado y sesión iniciada automáticamente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">🔧 URLs de Debug:</h3>
            <div className="space-y-1 text-sm">
              <div>• <a href="/debug-auth" className="text-blue-600 hover:underline">/debug-auth</a> - Diagnóstico completo</div>
              <div>• <a href="/test-register" className="text-blue-600 hover:underline">/test-register</a> - Esta página</div>
              <div>• <a href="/register" className="text-blue-600 hover:underline">/register</a> - Registro original</div>
              <div>• <a href="/login" className="text-blue-600 hover:underline">/login</a> - Login original</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}