import { Header } from '@/components/marketing/header'
import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { Pricing } from '@/components/marketing/pricing'
import { Footer } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}