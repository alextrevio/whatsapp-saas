'use client'

import { useEffect } from 'react'

export function CacheBuster() {
  useEffect(() => {
    // Crear un timestamp único para esta versión
    const currentVersion = Date.now()
    const storageKey = 'whatsapp-saas-version'
    
    // Obtener la versión almacenada
    const storedVersion = localStorage.getItem(storageKey)
    
    // Si es la primera visita o hay una nueva versión, limpiar todo
    if (!storedVersion || parseInt(storedVersion) < (currentVersion - 300000)) { // 5 minutos
      // Limpiar localStorage
      localStorage.clear()
      
      // Limpiar sessionStorage
      sessionStorage.clear()
      
      // Guardar nueva versión
      localStorage.setItem(storageKey, currentVersion.toString())
      
      // Forzar recarga si hay una versión anterior
      if (storedVersion) {
        // Pequeño delay para mostrar un mensaje si es necesario
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    }

    // Auto-refresh cada 5 minutos para obtener la versión más reciente
    const refreshInterval = setInterval(() => {
      const now = Date.now()
      const lastUpdate = parseInt(localStorage.getItem(storageKey) || '0')
      
      // Si han pasado más de 5 minutos, hacer soft refresh
      if (now - lastUpdate > 300000) {
        localStorage.setItem(storageKey, now.toString())
        // Soft refresh sin mostrar loading
        window.location.href = window.location.href + '?t=' + now
      }
    }, 300000) // 5 minutos

    return () => clearInterval(refreshInterval)
  }, [])

  return null
}