'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Rocket,
  Menu,
  X,
  Sparkles,
  Zap,
  Crown,
  Star
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Características', href: '#features' },
  { name: 'Precios', href: '/pricing' },
  { name: 'Recursos', href: '/help' },
  { name: 'Blog', href: '/blog' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-50">
      {/* Background with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
      
      <nav className="relative mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 group-hover:bg-clip-text transition-all duration-300">
                  WhatsPower
                </div>
                <div className="text-xs text-emerald-400 font-mono tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  // Unleash the Power
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative text-sm font-bold text-slate-300 hover:text-white transition-colors duration-300"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute -inset-x-2 -inset-y-1 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Comenzar Gratis
                  <Zap className="ml-2 h-4 w-4 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-6 sm:max-w-sm border-l border-slate-800/50 lg:hidden">
              {/* Mobile header */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-black text-white">WhatsPower</span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile navigation */}
              <div className="space-y-3 mb-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-base font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="space-y-3">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full font-bold border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Comenzar Gratis
                    <Crown className="ml-2 h-4 w-4 text-yellow-300" />
                  </Button>
                </Link>
              </div>

              {/* Mobile footer */}
              <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                <div className="text-xs text-slate-400 font-mono">
                  © 2024 WhatsPower • Empresa mexicana
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}