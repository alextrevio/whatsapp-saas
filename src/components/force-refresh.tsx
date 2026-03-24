'use client'

import { useEffect } from 'react'

export function ForceRefresh() {
  useEffect(() => {
    // Versión actual del diseño (timestamp de cuando se deployó el nuevo diseño)
    const CURRENT_DESIGN_VERSION = '2026032415'
    const VERSION_KEY = 'whatsapp-saas-design-version'
    
    // Obtener versión almacenada
    const storedVersion = localStorage.getItem(VERSION_KEY)
    
    console.log('🔄 Checking design version:', { storedVersion, current: CURRENT_DESIGN_VERSION })
    
    // Si no hay versión almacenada o es diferente, forzar refresh
    if (!storedVersion || storedVersion !== CURRENT_DESIGN_VERSION) {
      console.log('🚀 New design version detected! Forcing refresh...')
      
      // Limpiar todo el storage
      try {
        localStorage.clear()
        sessionStorage.clear()
        
        // Limpiar caché del service worker si existe
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.unregister())
          })
        }
        
        // Guardar nueva versión
        localStorage.setItem(VERSION_KEY, CURRENT_DESIGN_VERSION)
        
        // Forzar reload completo con cache busting
        const timestamp = Date.now()
        const currentUrl = window.location.href.split('?')[0] // Remover query params existentes
        const newUrl = `${currentUrl}?v=${timestamp}&refresh=true&design=${CURRENT_DESIGN_VERSION}`
        
        console.log('🔄 Redirecting to:', newUrl)
        
        // Hard reload
        window.location.href = newUrl
        
      } catch (error) {
        console.error('Error clearing cache:', error)
        // Fallback: simple reload
        window.location.reload()
      }
    } else {
      console.log('✅ Design version is up to date')
    }
    
    // Comprobar si venimos de un refresh forzado
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('refresh') === 'true') {
      console.log('🎉 Refresh completed! Cleaning URL...')
      
      // Limpiar la URL después de un segundo para no mostrar los parámetros
      setTimeout(() => {
        const cleanUrl = window.location.origin + window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }, 1000)
    }
    
  }, [])

  return null
}