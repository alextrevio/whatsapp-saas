'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signUpSchema, type SignUpInput } from '@/lib/validations'
import { Eye, EyeOff, MessageCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<SignUpInput>({
    email: '',
    password: '',
    organizationName: '',
  })
  const [errors, setErrors] = useState<Partial<SignUpInput>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = signUpSchema.parse(formData)
      
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            organization_name: validatedData.organizationName,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Redirigir a página de verificación o dashboard
      if (data.user && !data.user.email_confirmed_at) {
        router.push('/verify-email')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<SignUpInput> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0] as keyof SignUpInput] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ email: error.message || 'Error al crear cuenta' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Comienza tu prueba gratuita de WhatsApp Marketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nombre de tu organización"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                className={errors.organizationName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName}</p>}
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña (mín. 8 caracteres)"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </a>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Al registrarte aceptas nuestros{' '}
              <a href="/terms" className="text-primary hover:underline">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Política de Privacidad
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}