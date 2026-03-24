'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

export default function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    async function getDebugInfo() {
      try {
        // Test conexión básica
        const { data: session, error: sessionError } = await supabase.auth.getSession()
        
        // Test registro
        const testEmail = 'test-' + Date.now() + '@test.com'
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: 'test123456',
        })

        setDebugInfo({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
          currentSession: session,
          sessionError: sessionError?.message,
          testSignUp: {
            success: !signUpError,
            error: signUpError?.message,
            user: signUpData.user?.id || 'No user'
          }
        })
      } catch (error: any) {
        setDebugInfo({
          error: error.message,
          stack: error.stack
        })
      }
    }

    getDebugInfo()
  }, [])

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test123456'
      })

      setTestResult({
        success: !error,
        error: error?.message,
        data: data.user?.id || 'No user'
      })
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message
      })
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug de Autenticación</h1>
        
        <div className="grid gap-6">
          {/* Información de Debug */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Información del Sistema</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {debugInfo ? JSON.stringify(debugInfo, null, 2) : 'Cargando...'}
            </pre>
          </div>

          {/* Test de Login */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🧪 Test de Login</h2>
            <button 
              onClick={testLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Probar Login de Prueba
            </button>
            
            {testResult && (
              <pre className="bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Variables de Entorno */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔑 Variables de Entorno</h2>
            <div className="space-y-2 text-sm">
              <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ NOT SET'}</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET'}</div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">⚠️ Problemas Comunes</h2>
            <ul className="space-y-2 text-sm">
              <li>• Variables de entorno no configuradas correctamente</li>
              <li>• Supabase Auth no habilitado</li>
              <li>• Confirmación de email requerida</li>
              <li>• Problemas de CORS</li>
              <li>• Middleware bloqueando requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}