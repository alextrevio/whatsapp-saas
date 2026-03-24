'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signUpSchema, type SignUpInput } from '@/lib/validations'
import { Eye, EyeOff, MessageCircle, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, Bot, Users, BarChart3, MessageSquare } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<SignUpInput>({
    email: '',
    password: '',
    organizationName: '',
  })
  const [errors, setErrors] = useState<Partial<SignUpInput> & { general?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const validatedData = signUpSchema.parse(formData)
      
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            organization_name: validatedData.organizationName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        console.error('Supabase Auth Error:', error)
        
        // Manejar errores específicos de Supabase
        let errorMessage = 'Error al crear cuenta'
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifica el formato.'
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.'
        } else if (error.message.includes('signup is disabled')) {
          errorMessage = 'El registro está deshabilitado temporalmente.'
        }
        
        setErrors({ general: errorMessage })
        return
      }

      console.log('Registration successful:', data)
      setSuccess(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        if (data.user && !data.user.email_confirmed_at) {
          router.push('/verify-email')
        } else {
          router.push('/dashboard')
        }
      }, 2000)

    } catch (error: any) {
      console.error('Validation Error:', error)
      if (error.errors) {
        const fieldErrors: Partial<SignUpInput> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0] as keyof SignUpInput] = err.message
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
      <div className="relative flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-emerald-600 to-blue-600 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col justify-center max-w-lg">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold">WhatsApp SaaS</h1>
              </div>
              <p className="text-xl text-emerald-100 mb-8">
                La plataforma más avanzada para automatizar tu WhatsApp Business
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg mt-1">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Bots IA Inteligentes</h3>
                  <p className="text-emerald-100 text-sm">
                    GPT-4 powered bots que conversan naturalmente y califican leads automáticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg mt-1">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Automatizaciones Avanzadas</h3>
                  <p className="text-emerald-100 text-sm">
                    Flujos automáticos que responden por keywords, tiempo y comportamiento
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg mt-1">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">CRM Completo</h3>
                  <p className="text-emerald-100 text-sm">
                    Gestiona contactos, leads y conversaciones desde un solo lugar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg mt-1">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Inbox Unificado</h3>
                  <p className="text-emerald-100 text-sm">
                    Todas tus conversaciones de WhatsApp en tiempo real
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 text-emerald-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Prueba Gratuita</span>
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Sin límites por 30 días. Cancela cuando quieras.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp SaaS</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Tu plataforma de automatización</p>
            </div>

            <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Crear Cuenta
                </CardTitle>
                <CardDescription className="text-base">
                  Comienza tu transformación digital hoy mismo
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Success Message */}
                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ¡Cuenta creada exitosamente! Redirigiendo al dashboard...
                    </AlertDescription>
                  </Alert>
                )}

                {/* General Error */}
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Nombre de tu empresa u organización"
                      value={formData.organizationName}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                      className={`h-12 text-base ${errors.organizationName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-emerald-500'}`}
                      disabled={loading}
                    />
                    {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName}</p>}
                  </div>

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
                        placeholder="Contraseña segura (mín. 6 caracteres)"
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

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={loading || success}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Comenzar Prueba Gratuita
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o</span>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                      Inicia sesión aquí
                    </a>
                  </p>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Al registrarte aceptas nuestros{' '}
                    <a href="/terms" className="text-emerald-600 hover:text-emerald-700 underline">
                      Términos de Servicio
                    </a>{' '}
                    y{' '}
                    <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">
                      Política de Privacidad
                    </a>
                  </p>
                </div>

                {/* Features Preview */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-center mb-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      ✨ Incluye en tu prueba gratuita
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <span className="text-gray-600">Bots IA ilimitados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <span className="text-gray-600">Automatizaciones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <span className="text-gray-600">CRM completo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <span className="text-gray-600">Soporte 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}