'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Upload,
  Phone,
  Mail,
  Tag,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Contact {
  id: string
  phone_number: string
  name?: string
  tags: string[]
  custom_fields: Record<string, any>
  last_interaction?: string
  created_at: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      phone_number: '+52 555-0123',
      name: 'Juan Pérez',
      tags: ['cliente', 'vip'],
      custom_fields: { empresa: 'TechCorp', ciudad: 'México' },
      last_interaction: '2024-01-20T10:30:00Z',
      created_at: '2024-01-15T09:00:00Z',
    },
    {
      id: '2',
      phone_number: '+52 555-0456',
      name: 'María García',
      tags: ['prospecto'],
      custom_fields: { empresa: 'StartupXYZ' },
      last_interaction: '2024-01-19T15:45:00Z',
      created_at: '2024-01-18T14:20:00Z',
    },
    {
      id: '3',
      phone_number: '+52 555-0789',
      tags: ['lead'],
      custom_fields: {},
      created_at: '2024-01-21T11:15:00Z',
    }
  ])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Obtener todos los tags únicos
  const allTags = Array.from(
    new Set(contacts.flatMap(contact => contact.tags))
  )

  // Filtrar contactos
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === '' || 
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone_number.includes(searchQuery)
    
    const matchesTag = selectedTag === '' || contact.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  const getContactInitials = (contact: Contact) => {
    if (contact.name) {
      return contact.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return contact.phone_number.slice(-2)
  }

  const getTagColor = (tag: string) => {
    const colors = {
      'cliente': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'vip': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'prospecto': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'lead': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    }
    return colors[tag as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Contactos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tu base de contactos de WhatsApp
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/contacts/import">
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/contacts/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Contacto
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Contactos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {contacts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Clientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {contacts.filter(c => c.tags.includes('cliente')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Prospectos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {contacts.filter(c => c.tags.includes('prospecto')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nuevos (7 días)
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {contacts.filter(c => {
                    const daysDiff = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)
                    return daysDiff <= 7
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
              >
                <option value="">Todos los tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table/Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contactos ({filteredContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron contactos
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedTag 
                  ? 'Prueba con diferentes filtros de búsqueda'
                  : 'Comienza agregando tu primer contacto'
                }
              </p>
              <Button asChild>
                <Link href="/dashboard/contacts/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Contacto
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          {getContactInitials(contact)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {contact.name || 'Sin nombre'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {contact.phone_number}
                          </div>
                          {contact.last_interaction && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              Última interacción: {formatDate(contact.last_interaction)}
                            </div>
                          )}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex items-center space-x-2 mt-2">
                          {contact.tags.map(tag => (
                            <Badge key={tag} className={getTagColor(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Custom Fields */}
                        {Object.keys(contact.custom_fields).length > 0 && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {Object.entries(contact.custom_fields).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                <strong>{key}:</strong> {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}