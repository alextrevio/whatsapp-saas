'use client'

import Link from 'next/link'
import { 
  Rocket,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
  Zap,
  Globe
} from 'lucide-react'

const navigation = {
  product: [
    { name: 'Características', href: '/#features' },
    { name: 'Precios', href: '/pricing' },
    { name: 'API', href: '/docs/api' },
    { name: 'Integraciones', href: '/integrations' },
    { name: 'Changelog', href: '/changelog' },
  ],
  support: [
    { name: 'Centro de Ayuda', href: '/help' },
    { name: 'Documentación', href: '/docs' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Status', href: '/status' },
    { name: 'Comunidad', href: '/community' },
  ],
  company: [
    { name: 'Acerca de', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carreras', href: '/careers' },
    { name: 'Prensa', href: '/press' },
    { name: 'Partners', href: '/partners' },
  ],
  legal: [
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Términos', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ],
}

const social = [
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: '#',
    icon: Youtube,
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-black border-t border-slate-800/50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.02)_1px,transparent_1px)] bg-[length:32px_32px]"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="py-16">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            {/* Company info */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl opacity-20 blur animate-pulse"></div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-black text-white tracking-tight">
                    WhatsPower
                  </div>
                  <div className="text-sm text-emerald-400 font-mono tracking-wider uppercase">
                    // Unleash the Power
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-400 font-medium leading-relaxed max-w-md">
                  La plataforma definitiva para automatizar WhatsApp Business. 
                  Conecta IA, automatiza campañas y convierte cada conversación en resultados reales.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">Ciudad de México, México</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">hola@whatspower.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <Phone className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">+52 (55) 1234-5678</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="flex space-x-4">
                {social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group p-2 bg-slate-800/50 rounded-xl hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <item.icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-lg font-black text-white mb-6">Producto</h3>
                  <ul className="space-y-4">
                    {navigation.product.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-slate-400 hover:text-emerald-400 font-medium transition-colors duration-300 hover:translate-x-1 inline-block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-lg font-black text-white mb-6">Soporte</h3>
                  <ul className="space-y-4">
                    {navigation.support.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-slate-400 hover:text-emerald-400 font-medium transition-colors duration-300 hover:translate-x-1 inline-block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-lg font-black text-white mb-6">Empresa</h3>
                  <ul className="space-y-4">
                    {navigation.company.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-slate-400 hover:text-emerald-400 font-medium transition-colors duration-300 hover:translate-x-1 inline-block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-lg font-black text-white mb-6">Legal</h3>
                  <ul className="space-y-4">
                    {navigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-slate-400 hover:text-emerald-400 font-medium transition-colors duration-300 hover:translate-x-1 inline-block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-8 border-t border-slate-800/50">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <p className="text-slate-400 font-medium">
                © 2024 WhatsPower. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-2 text-slate-400">
                <span>Hecho con</span>
                <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
                <span>en México</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 font-mono text-sm">Status: Operacional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-400 font-mono text-sm">Uptime: 99.9%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final branding */}
          <div className="mt-8 pt-6 border-t border-slate-800/30 text-center">
            <div className="flex items-center justify-center space-x-4 text-slate-500">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="font-mono text-sm">Powered by Next.js</span>
              </div>
              <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="font-mono text-sm">Built for WhatsApp</span>
              </div>
              <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
              <div className="font-mono text-sm">v2.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}