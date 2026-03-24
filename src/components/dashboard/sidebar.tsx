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
  Zap,
  Settings,
  BarChart3,
  X,
  ChevronDown,
  ChevronRight,
  Bot,
  Inbox,
  Plus,
  Search
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Conversations',
    icon: MessageCircle,
    children: [
      { name: 'Inbox', href: '/dashboard/whatsapp/inbox', icon: Inbox },
      { name: 'Sessions', href: '/dashboard/whatsapp/sessions', icon: MessageCircle },
      { name: 'AI Bots', href: '/dashboard/whatsapp/bots', icon: Bot },
    ]
  },
  {
    name: 'Contacts',
    href: '/dashboard/contacts',
    icon: Users,
  },
  {
    name: 'Campaigns',
    href: '/dashboard/campaigns', 
    icon: Send,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Automation',
    href: '/dashboard/automation',
    icon: Zap,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Conversations'])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isItemActive = (href: string) => pathname === href
  const isParentActive = (children?: { href: string }[]) => 
    children?.some(child => pathname === child.href)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-600/75" onClick={onClose} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">WhatsPower</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                const isExpanded = expandedItems.includes(item.name)
                const isActive = isParentActive(item.children)
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-teal-50 text-teal-700" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isItemActive(child.href)
                                ? "bg-teal-600 text-white"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            )}
                          >
                            <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
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
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isItemActive(item.href)
                      ? "bg-teal-600 text-white"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-200 p-4">
          <Button 
            size="sm" 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
          
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">Usage</span>
              <span className="text-sm font-bold text-slate-900">2.4k / 10k</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-teal-600 rounded-full" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Messages this month
            </p>
          </div>
        </div>
      </div>
    </>
  )
}