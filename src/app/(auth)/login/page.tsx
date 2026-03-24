'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInSchema, type SignInInput } from '@/lib/validations'
import { Eye, EyeOff, MessageCircle, Loader2, AlertCircle, LogIn } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<SignInInput>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<SignInInput> & { general?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = signInSchema.parse(formData)
      
      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

      if (error) {
        console.error('Login Error:', error)
        
        // Manejar errores específicos
        let errorMessage = 'Error al iniciar sesión'
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email o contraseña incorrectos'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Confirma tu email antes de iniciar sesión'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Demasiados intentos. Intenta en unos minutos.'
        }
        
        setErrors({ general: errorMessage })
        return
      }

      // Redirigir al dashboard
      router.push('/dashboard')
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<SignInInput> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0] as keyof SignInInput] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: 'Error inesperado. Inténtalo de nuevo.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              WhatsApp SaaS
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenido de vuelta a tu plataforma
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Accede a tu dashboard de automatización
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`h-12 text-base ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-emerald-500'}`}
                    disabled={loading}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`h-12 text-base pr-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-emerald-500'}`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                      Recordar sesión
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o continúa con</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 text-base border-gray-200 hover:bg-gray-50 transition-all duration-200" 
                disabled={loading}
                onClick={() => {
                  // Google OAuth integration would go here
                  console.log('Google login clicked')
                }}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </Button>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes cuenta?{' '}
                  <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    Regístrate gratis
                  </a>
                </p>

                {/* Quick Login for Demo */}
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    💡 Demo rápido
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    Email: demo@whatsapp-saas.com / Password: demo123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 WhatsApp SaaS. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}