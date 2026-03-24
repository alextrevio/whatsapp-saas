'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Palette, 
  Image, 
  Globe, 
  Mail,
  Code,
  Crown,
  Save,
  Eye,
  Upload,
  AlertCircle,
  CheckCircle,
  Link,
  Trash2
} from 'lucide-react'
import { 
  WhiteLabelConfig, 
  DEFAULT_WHITELABEL_CONFIG,
  isValidHexColor,
  isValidCustomDomain 
} from '@/lib/whitelabel'

export default function BrandingPage() {
  const [config, setConfig] = useState<WhiteLabelConfig>(DEFAULT_WHITELABEL_CONFIG)
  const [currentPlan, setCurrentPlan] = useState<string>('pro') // Mock plan
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewMode, setPreviewMode] = useState(false)

  const hasWhiteLabelAccess = currentPlan === 'enterprise'

  useEffect(() => {
    // Load current white-label configuration
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      // En implementación real, cargarías desde la API
      // const response = await fetch('/api/whitelabel/config')
      // const data = await response.json()
      // setConfig(data.config)
      
      // Mock data for demo
      const mockConfig: WhiteLabelConfig = {
        branding: {
          appName: 'MiPlataforma WhatsApp',
          logo: '/custom-logo.png',
          favicon: '/favicon.ico',
          primaryColor: '#3b82f6',
          secondaryColor: '#1d4ed8'
        },
        domain: {
          customDomain: 'whatsapp.miempresa.com',
          subdomain: 'miempresa'
        },
        emails: {
          fromName: 'Mi Empresa',
          fromEmail: 'noreply@miempresa.com',
          supportEmail: 'soporte@miempresa.com',
          customTemplates: true
        },
        features: {
          removeBranding: true,
          customFooter: '© 2024 Mi Empresa. Todos los derechos reservados.',
          hideAtlasBranding: true
        },
        integrations: {
          googleAnalytics: 'GA-XXXXXXXXX',
          facebookPixel: '123456789'
        }
      }
      
      setConfig(mockConfig)
    } catch (error) {
      console.error('Error loading config:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar colores
    if (!isValidHexColor(config.branding.primaryColor)) {
      newErrors.primaryColor = 'Color primario inválido'
    }
    if (!isValidHexColor(config.branding.secondaryColor)) {
      newErrors.secondaryColor = 'Color secundario inválido'
    }

    // Validar dominio personalizado
    if (config.domain.customDomain && !isValidCustomDomain(config.domain.customDomain)) {
      newErrors.customDomain = 'Dominio personalizado inválido'
    }

    // Validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(config.emails.fromEmail)) {
      newErrors.fromEmail = 'Email inválido'
    }
    if (!emailRegex.test(config.emails.supportEmail)) {
      newErrors.supportEmail = 'Email de soporte inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      // En implementación real, guardarías en la API
      // await fetch('/api/whitelabel/config', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config)
      // })

      console.log('Saving white-label config:', config)
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const keys = path.split('.')
      const newConfig = { ...prev }
      let current = newConfig as any

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  if (!hasWhiteLabelAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Personalización de Marca
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personaliza la apariencia de tu plataforma
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              White-label Disponible en Enterprise
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Actualiza a Enterprise para personalizar completamente tu marca y dominio
            </p>
            <Button>
              Actualizar a Enterprise
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Personalización de Marca
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configura tu marca personalizada para la plataforma
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Vista Previa'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Preview Mode Banner */}
      {previewMode && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800 dark:text-blue-300">
                Modo Vista Previa - Los cambios se aplicarían en tiempo real
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Identidad Visual
            </CardTitle>
            <CardDescription>
              Configura el nombre, colores y logo de tu marca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="appName">Nombre de la Aplicación</Label>
              <Input
                id="appName"
                value={config.branding.appName}
                onChange={(e) => updateConfig('branding.appName', e.target.value)}
                placeholder="Mi Plataforma WhatsApp"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Color Primario</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primaryColor"
                    value={config.branding.primaryColor}
                    onChange={(e) => updateConfig('branding.primaryColor', e.target.value)}
                    placeholder="#3b82f6"
                    className={errors.primaryColor ? 'border-red-500' : ''}
                  />
                  <input
                    type="color"
                    value={config.branding.primaryColor}
                    onChange={(e) => updateConfig('branding.primaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md"
                  />
                </div>
                {errors.primaryColor && (
                  <p className="text-sm text-red-500 mt-1">{errors.primaryColor}</p>
                )}
              </div>

              <div>
                <Label htmlFor="secondaryColor">Color Secundario</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondaryColor"
                    value={config.branding.secondaryColor}
                    onChange={(e) => updateConfig('branding.secondaryColor', e.target.value)}
                    placeholder="#1d4ed8"
                    className={errors.secondaryColor ? 'border-red-500' : ''}
                  />
                  <input
                    type="color"
                    value={config.branding.secondaryColor}
                    onChange={(e) => updateConfig('branding.secondaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md"
                  />
                </div>
                {errors.secondaryColor && (
                  <p className="text-sm text-red-500 mt-1">{errors.secondaryColor}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Logo de la Marca</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  {config.branding.logo ? (
                    <img src={config.branding.logo} alt="Logo" className="w-12 h-12 object-contain" />
                  ) : (
                    <Image className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Logo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Recomendado: 200x200px, formato PNG con fondo transparente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Domain Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Configuración de Dominio
            </CardTitle>
            <CardDescription>
              Configura tu dominio personalizado y subdominio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customDomain">Dominio Personalizado</Label>
              <Input
                id="customDomain"
                value={config.domain.customDomain || ''}
                onChange={(e) => updateConfig('domain.customDomain', e.target.value)}
                placeholder="whatsapp.miempresa.com"
                className={errors.customDomain ? 'border-red-500' : ''}
              />
              {errors.customDomain && (
                <p className="text-sm text-red-500 mt-1">{errors.customDomain}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Debes configurar un CNAME que apunte a nuestros servidores
              </p>
            </div>

            <div>
              <Label htmlFor="subdomain">Subdominio</Label>
              <div className="flex">
                <Input
                  id="subdomain"
                  value={config.domain.subdomain || ''}
                  onChange={(e) => updateConfig('domain.subdomain', e.target.value)}
                  placeholder="miempresa"
                  className="rounded-r-none"
                />
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md text-sm text-gray-600 dark:text-gray-400">
                  .whatsappsaas.com
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                URL: https://{config.domain.subdomain || 'miempresa'}.whatsappsaas.com
              </p>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <p className="font-medium">Configuración DNS requerida</p>
                  <p>Contacta a soporte para configurar tu dominio personalizado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Configuración de Emails
            </CardTitle>
            <CardDescription>
              Personaliza los emails que envía tu plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromName">Nombre del Remitente</Label>
              <Input
                id="fromName"
                value={config.emails.fromName}
                onChange={(e) => updateConfig('emails.fromName', e.target.value)}
                placeholder="Mi Empresa"
              />
            </div>

            <div>
              <Label htmlFor="fromEmail">Email del Remitente</Label>
              <Input
                id="fromEmail"
                type="email"
                value={config.emails.fromEmail}
                onChange={(e) => updateConfig('emails.fromEmail', e.target.value)}
                placeholder="noreply@miempresa.com"
                className={errors.fromEmail ? 'border-red-500' : ''}
              />
              {errors.fromEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.fromEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supportEmail">Email de Soporte</Label>
              <Input
                id="supportEmail"
                type="email"
                value={config.emails.supportEmail}
                onChange={(e) => updateConfig('emails.supportEmail', e.target.value)}
                placeholder="soporte@miempresa.com"
                className={errors.supportEmail ? 'border-red-500' : ''}
              />
              {errors.supportEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.supportEmail}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customTemplates"
                checked={config.emails.customTemplates}
                onChange={(e) => updateConfig('emails.customTemplates', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="customTemplates">
                Usar templates personalizados
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Características Avanzadas
            </CardTitle>
            <CardDescription>
              Controla qué elementos mostrar u ocultar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="removeBranding"
                  checked={config.features.removeBranding}
                  onChange={(e) => updateConfig('features.removeBranding', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="removeBranding">
                  Remover marca "WhatsApp SaaS"
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hideAtlasBranding"
                  checked={config.features.hideAtlasBranding}
                  onChange={(e) => updateConfig('features.hideAtlasBranding', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="hideAtlasBranding">
                  Ocultar marca "Atlas"
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="customFooter">Footer Personalizado</Label>
              <Textarea
                id="customFooter"
                value={config.features.customFooter || ''}
                onChange={(e) => updateConfig('features.customFooter', e.target.value)}
                placeholder="© 2024 Mi Empresa. Todos los derechos reservados."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="customCss">CSS Personalizado</Label>
              <Textarea
                id="customCss"
                value={config.features.customCss || ''}
                onChange={(e) => updateConfig('features.customCss', e.target.value)}
                placeholder=":root { --custom-accent: #ff6b6b; }"
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                CSS personalizado para estilos adicionales
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Scripts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Integraciones y Scripts
          </CardTitle>
          <CardDescription>
            Añade Google Analytics, Facebook Pixel y scripts personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
              <Input
                id="googleAnalytics"
                value={config.integrations.googleAnalytics || ''}
                onChange={(e) => updateConfig('integrations.googleAnalytics', e.target.value)}
                placeholder="GA-XXXXXXXXX"
              />
            </div>

            <div>
              <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
              <Input
                id="facebookPixel"
                value={config.integrations.facebookPixel || ''}
                onChange={(e) => updateConfig('integrations.facebookPixel', e.target.value)}
                placeholder="123456789"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
        </Button>
      </div>
    </div>
  )
}