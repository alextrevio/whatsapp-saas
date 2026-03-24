import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhatsPower - Automatización WhatsApp para Empresas',
  description: 'Conecta WhatsApp con tu empresa. Bots IA, campañas automatizadas, gestión de contactos y más. La plataforma definitiva para WhatsApp Business.',
  keywords: 'WhatsApp, automatización, bots IA, marketing, campañas, empresas',
  authors: [{ name: 'WhatsPower' }],
  creator: 'WhatsPower',
  publisher: 'WhatsPower',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://whatspower.com',
    title: 'WhatsPower - Automatización WhatsApp para Empresas',
    description: 'La plataforma definitiva para automatizar tu WhatsApp Business',
    siteName: 'WhatsPower',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsPower - Automatización WhatsApp para Empresas',
    description: 'La plataforma definitiva para automatizar tu WhatsApp Business',
    creator: '@whatspower',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {children}
      </div>
    </ThemeProvider>
  )
}