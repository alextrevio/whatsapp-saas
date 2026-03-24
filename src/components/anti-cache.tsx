'use client'

import { useEffect } from 'react'

export function AntiCache() {
  useEffect(() => {
    // Timestamp de cuando se implementó la solución definitiva
    const SOLUTION_VERSION = '20260324203800' // YYYYMMDDHHmmSS
    const VERSION_KEY = 'whatsapp-saas-solution-version'
    
    try {
      // Obtener versión almacenada
      const storedVersion = localStorage.getItem(VERSION_KEY)
      
      console.log('🔧 ANTI-CACHE: Checking solution version:', { 
        stored: storedVersion, 
        current: SOLUTION_VERSION 
      })
      
      // Si no hay versión o es diferente, limpiar TODO
      if (!storedVersion || storedVersion !== SOLUTION_VERSION) {
        console.log('🚀 ANTI-CACHE: New solution version! Clearing ALL cache...')
        
        // 1. Limpiar localStorage completo
        localStorage.clear()
        
        // 2. Limpiar sessionStorage completo  
        sessionStorage.clear()
        
        // 3. Limpiar cookies relacionadas con el cache
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        })
        
        // 4. Desregistrar service workers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister()
              console.log('🧹 ANTI-CACHE: Service worker unregistered')
            })
          })
        }
        
        // 5. Limpiar cache de la aplicación
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name)
              console.log('🧹 ANTI-CACHE: Cache deleted:', name)
            })
          })
        }
        
        // 6. Guardar nueva versión
        localStorage.setItem(VERSION_KEY, SOLUTION_VERSION)
        
        // 7. Forzar recarga COMPLETA si había versión anterior
        if (storedVersion) {
          console.log('🔄 ANTI-CACHE: Forcing complete reload...')
          
          // Agregar timestamp único a la URL
          const url = new URL(window.location.href)
          url.searchParams.set('v', Date.now().toString())
          url.searchParams.set('cache-bust', Math.random().toString(36).substring(7))
          
          // Reload forzado con nueva URL
          window.location.href = url.toString()
        }
      } else {
        console.log('✅ ANTI-CACHE: Solution version is current')
      }
      
      // Auto-refresh cada 10 minutos para obtener updates
      const refreshInterval = setInterval(() => {
        const now = Date.now()
        const lastUpdate = parseInt(localStorage.getItem(VERSION_KEY + '-last-check') || '0')
        
        if (now - lastUpdate > 600000) { // 10 minutos
          localStorage.setItem(VERSION_KEY + '-last-check', now.toString())
          console.log('🔄 ANTI-CACHE: Auto-refresh check...')
          
          // Soft refresh con cache busting
          const url = new URL(window.location.href)
          url.searchParams.set('t', now.toString())
          
          if (url.toString() !== window.location.href) {
            window.location.href = url.toString()
          }
        }
      }, 600000) // 10 minutos
      
      return () => clearInterval(refreshInterval)
      
    } catch (error) {
      console.error('❌ ANTI-CACHE: Error:', error)
      // En caso de error, forzar reload simple
      window.location.reload()
    }
  }, [])

  return (
    <>
      {/* Meta tag con timestamp para forzar refresh del HTML */}
      <meta name="cache-bust" content={Date.now().toString()} />
      <meta name="build-timestamp" content={new Date().toISOString()} />
    </>
  )
}