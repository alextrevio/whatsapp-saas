'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  MessageCircle,
  Home,
  Users,
  Send,
  Settings,
  Phone,
  BarChart3,
  Zap,
  X,
  ChevronDown,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { 
    name: 'WhatsApp',
    icon: MessageCircle,
    children: [
      { name: 'Sesiones', href: '/dashboard/whatsapp/sessions' },
      { name: 'Bandeja de Entrada', href: '/dashboard/whatsapp/inbox' },
    ]
  },
  {
    name: 'Contactos',
    icon: Users,
    children: [
      { name: 'Lista de Contactos', href: '/dashboard/contacts' },
      { name: 'Importar CSV', href: '/dashboard/contacts/import' },
    ]
  },
  {
    name: 'Campañas',
    icon: Send,
    children: [
      { name: 'Lista de Campañas', href: '/dashboard/campaigns' },
      { name: 'Nueva Campaña', href: '/dashboard/campaigns/new' },
    ]
  },
  { name: 'Analíticas', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Automatización', href: '/dashboard/automation', icon: Zap },

  {
    name: 'Configuración',
    icon: Settings,
    children: [
      { name: 'Organización', href: '/dashboard/settings/organization' },

      { name: 'Integraciones', href: '/dashboard/settings/integrations' },
    ]
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['WhatsApp'])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:inset-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              WhatsApp SaaS
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Organization selector */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Mi Organización
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.includes(item.name)
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group text-left",
                      "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    <ChevronDown className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center px-2 py-2 text-sm rounded-md",
                            pathname === child.href
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
                  pathname === item.href
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}