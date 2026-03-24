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
    name: 'Overview',
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
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-zinc-950 border-r border-zinc-800/50 transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800/50">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-sm font-semibold text-zinc-50">WhatsPower</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-zinc-800/50 bg-zinc-900/20 py-2 pl-10 pr-4 text-sm text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
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
                        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-zinc-800/50 text-zinc-50" 
                          : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/25"
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-zinc-800/50 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              isItemActive(child.href)
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/25"
                            )}
                          >
                            <child.icon className="mr-3 h-4 w-4" />
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
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isItemActive(item.href)
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/25"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-zinc-800/50 p-4">
          <Button 
            size="sm" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
          
          <div className="mt-4 rounded-md border border-zinc-800/50 bg-zinc-900/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Usage</span>
              <span className="text-xs text-zinc-500">2.4k / 10k</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-emerald-500 rounded-full" />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Messages this month
            </p>
          </div>
        </div>
      </div>
    </>
  )
}