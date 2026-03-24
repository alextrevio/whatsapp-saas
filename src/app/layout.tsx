import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers-simple'
import { AntiCache } from '@/components/anti-cache'

const inter = Inter({ subsets: ['latin'] })

const buildTime = Date.now().toString()

export const metadata: Metadata = {
  title: 'WhatsApp SaaS - Marketing Automation Platform',
  description: 'Plataforma completa de automatización de WhatsApp para agencias de marketing',
  keywords: 'WhatsApp, automation, marketing, SaaS, CRM',
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'build-time': buildTime,
    'cache-bust': Math.random().toString(),
    'version': buildTime,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <AntiCache />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}