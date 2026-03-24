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
  Building2,
  Zap,
  Settings,
  Phone,
  BarChart3,
  X,
  ChevronDown,
  Rocket,
  Bot,
  Sparkles,
  Crown,
  Orbit,
  Lightning,
  Shield,
  Star
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { 
    name: 'Command Center', 
    href: '/dashboard', 
    icon: Home, 
    color: 'from-emerald-500 to-teal-500',
    premium: false
  },
  { 
    name: 'WhatsApp Core',
    icon: MessageCircle,
    color: 'from-green-500 to-emerald-500',
    premium: false,
    children: [
      { name: 'Sessions', href: '/dashboard/whatsapp/sessions', icon: Shield },
      { name: 'Inbox', href: '/dashboard/whatsapp/inbox', icon: MessageCircle },
      { name: 'AI Bots', href: '/dashboard/whatsapp/bots', icon: Bot, premium: true },
    ]
  },
  {
    name: 'Contacts Hub',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    premium: false,
    children: [
      { name: 'Contact List', href: '/dashboard/contacts', icon: Users },
      { name: 'CSV Import', href: '/dashboard/contacts/import', icon: Zap },
    ]
  },
  {
    name: 'Campaigns',
    icon: Send,
    color: 'from-purple-500 to-pink-500',
    premium: false,
    children: [
      { name: 'All Campaigns', href: '/dashboard/campaigns', icon: Send },
    ]
  },
  {
    name: 'Automation',
    href: '/dashboard/automation',
    icon: Lightning,
    color: 'from-orange-500 to-red-500',
    premium: true
  },
  {
    name: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'from-gray-500 to-slate-500',
    premium: false
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['WhatsApp Core'])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <>
      {/* Mobile overlay with modern blur */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        </div>
      )}

      {/* Futuristic Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 flex flex-col w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-r border-slate-800/50 transform transition-all duration-300 ease-out z-50 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:inset-0"
      )}>
        {/* Cyberpunk Header */}
        <div className="relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-blue-900/20 to-purple-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
          
          <div className="relative flex items-center justify-between h-20 px-6 border-b border-slate-800/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl opacity-20 blur animate-pulse"></div>
              </div>
              <div>
                <div className="text-lg font-black text-white tracking-tight">
                  WhatsPower
                </div>
                <div className="text-xs text-emerald-400 font-mono tracking-wider">
                  v2.1.0 • ONLINE
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden hover:bg-slate-800/50 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* User Status Card */}
        <div className="p-4">
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5"></div>
            <div className="relative flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">Alejandro</div>
                <div className="text-xs text-slate-400 font-mono">Admin • Pro Plan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gaming-inspired Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
          {navigation.map((item, index) => {
            if (item.children) {
              const isExpanded = expandedItems.includes(item.name)
              const isActive = item.children.some(child => pathname === child.href)
              
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl group text-left transition-all duration-300 hover:-translate-y-0.5",
                      isActive || isExpanded
                        ? "bg-gradient-to-r bg-slate-800/80 text-white shadow-lg border border-slate-700/50"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    )}
                  >
                    <div className={`p-2.5 rounded-xl mr-3 transition-all duration-300 group-hover:scale-110 ${
                      isActive || isExpanded
                        ? `bg-gradient-to-br ${item.color} shadow-lg`
                        : 'bg-slate-800/50'
                    }`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.premium && (
                          <div className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-black rounded-full">
                            PRO
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isExpanded && "rotate-180"
                    )} />
                    
                    {(isActive || isExpanded) && (
                      <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full"></div>
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-4 space-y-1 overflow-hidden">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group hover:-translate-y-0.5",
                            pathname === child.href
                              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                          )}
                        >
                          <div className={`p-1.5 rounded-lg mr-3 transition-all duration-200 group-hover:scale-110 ${
                            pathname === child.href
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                              : 'bg-slate-700/50'
                          }`}>
                            <child.icon className="h-3.5 w-3.5 text-white" />
                          </div>
                          
                          <span className="flex-1">{child.name}</span>
                          
                          {child.premium && (
                            <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                          )}
                          
                          {pathname === child.href && (
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-bold rounded-2xl group transition-all duration-300 hover:-translate-y-0.5 relative",
                  isActive
                    ? "bg-gradient-to-r bg-slate-800/80 text-white shadow-lg border border-slate-700/50"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <div className={`p-2.5 rounded-xl mr-3 transition-all duration-300 group-hover:scale-110 ${
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-lg`
                    : 'bg-slate-800/50'
                }`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span>{item.name}</span>
                    {item.premium && (
                      <div className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-black rounded-full">
                        PRO
                      </div>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <>
                    <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Status Bar */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">System Status</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="font-bold text-white">3</div>
                <div className="text-slate-400 font-mono">Sessions</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">1.2k</div>
                <div className="text-slate-400 font-mono">Messages</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-slate-400 font-mono">
                Uptime: 99.9% • v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}