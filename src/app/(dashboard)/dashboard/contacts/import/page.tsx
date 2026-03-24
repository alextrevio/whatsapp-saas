'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface CSVRow {
  phone_number: string
  name?: string
  tags?: string
  [key: string]: any
}

interface ImportResult {
  valid: CSVRow[]
  invalid: { row: number; data: any; errors: string[] }[]
}

export default function ImportContactsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const validatePhoneNumber = (phone: string): boolean => {
    // Regex básico para números de teléfono internacionales
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''))
  }

  const processCSV = useCallback((csvText: string): ImportResult => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    const result: ImportResult = {
      valid: [],
      invalid: []
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: any = {}
      const errors: string[] = []

      // Mapear valores a headers
      headers.forEach((header, index) => {
        if (values[index]) {
          row[header] = values[index]
        }
      })

      // Validar teléfono (campo requerido)
      if (!row.phone_number && !row.telefono && !row.phone) {
        errors.push('Número de teléfono requerido')
      } else {
        const phone = row.phone_number || row.telefono || row.phone
        if (!validatePhoneNumber(phone)) {
          errors.push('Formato de teléfono inválido')
        } else {
          row.phone_number = phone.startsWith('+') ? phone : `+${phone}`
        }
      }

      // Procesar tags
      if (row.tags) {
        row.tags = row.tags.split(';').map((t: string) => t.trim()).filter(Boolean)
      }

      if (errors.length === 0) {
        result.valid.push(row)
      } else {
        result.invalid.push({ row: i + 1, data: row, errors })
      }
    }

    return result
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Por favor selecciona un archivo CSV')
      return
    }
    
    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      const result = processCSV(csvText)
      setImportResult(result)
    }
    reader.readAsText(selectedFile)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleImport = async () => {
    if (!importResult || importResult.valid.length === 0) return

    setImporting(true)
    
    try {
      // Simular importación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // En una implementación real, aquí enviarías los datos a tu API
      console.log('Importing contacts:', importResult.valid)
      
      router.push('/dashboard/contacts?imported=true')
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `phone_number,name,tags,empresa,ciudad
+52 555-0123,Juan Pérez,cliente;vip,TechCorp,México
+52 555-0456,María García,prospecto,StartupXYZ,Guadalajara`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'plantilla-contactos.csv'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/contacts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Importar Contactos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Importa contactos desde un archivo CSV
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subir Archivo CSV</CardTitle>
              <CardDescription>
                Arrastra y suelta tu archivo CSV o haz clic para seleccionarlo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {file ? file.name : 'Selecciona un archivo CSV'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Máximo 10MB • Formatos: .csv
                  </p>
                </div>
                
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0]
                    if (selectedFile) handleFileSelect(selectedFile)
                  }}
                  className="mt-4 max-w-xs mx-auto"
                />
              </div>

              {file && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Results */}
          {importResult && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Vista Previa de Importación</CardTitle>
                <CardDescription>
                  Revisa los contactos antes de importar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        {importResult.valid.length} Válidos
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Listos para importar
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">
                        {importResult.invalid.length} Errores
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Requieren corrección
                      </p>
                    </div>
                  </div>
                </div>

                {importResult.valid.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                      Contactos Válidos (mostrando primeros 5)
                    </h4>
                    <div className="space-y-2">
                      {importResult.valid.slice(0, 5).map((contact, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {contact.name || 'Sin nombre'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {contact.phone_number}
                              </p>
                            </div>
                            {contact.tags && Array.isArray(contact.tags) && contact.tags.length > 0 && (
                              <div className="flex space-x-1">
                                {(contact.tags as string[]).slice(0, 2).map((tag: string) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                                {(contact.tags as string[]).length > 2 && (
                                  <Badge variant="secondary">
                                    +{(contact.tags as string[]).length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {importResult.valid.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... y {importResult.valid.length - 5} más
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {importResult.invalid.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-red-600">
                      Errores Encontrados
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {importResult.invalid.map((item, index) => (
                        <div key={index} className="p-3 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-red-800 dark:text-red-300">
                                Fila {item.row}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.data.name || item.data.phone_number || 'Sin datos'}
                              </p>
                              <ul className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {item.errors.map((error, errIndex) => (
                                  <li key={errIndex}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.valid.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      onClick={handleImport} 
                      disabled={importing}
                      className="w-full"
                    >
                      {importing ? 'Importando...' : `Importar ${importResult.valid.length} Contactos`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Formato del CSV</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>phone_number</strong> (requerido)</li>
                <li>• <strong>name</strong> (opcional)</li>
                <li>• <strong>tags</strong> (opcional, separados por ;)</li>
                <li>• Campos personalizados (empresa, ciudad, etc.)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Formato de Teléfono</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Incluye código de país: +52 555-0123</li>
                <li>• Sin espacios ni caracteres especiales</li>
                <li>• Máximo 15 dígitos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Separa múltiples tags con punto y coma (;)<br/>
                Ejemplo: cliente;vip;mexico
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Plantilla
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}