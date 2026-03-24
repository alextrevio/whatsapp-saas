import { Header } from '@/components/marketing/header'
import { Hero } from '@/components/marketing/hero'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Features section placeholder */}
      <section id="features" className="py-20">
        <div className="text-center text-white">
          <h2 className="text-4xl font-black mb-4">Próximamente: Sección de características</h2>
          <p className="text-slate-400">Esta página se está construyendo con las nuevas skills de diseño</p>
        </div>
      </section>
    </main>
  )
}