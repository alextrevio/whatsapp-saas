import { Header } from '@/components/marketing/header'
import { Pricing } from '@/components/marketing/pricing'
import { Footer } from '@/components/marketing/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precios - WhatsPower',
  description: 'Planes que escalan contigo. Desde startup hasta enterprise. Paga solo por lo que necesitas.',
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20"> {/* Offset for fixed header */}
        <Pricing />
      </div>
      <Footer />
    </main>
  )
}