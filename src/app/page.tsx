import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  MessageCircle, 
  Bot, 
  Users, 
  Zap,
  BarChart3,
  Shield,
  Check,
  Star,
  ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: "AI-Powered Conversations",
    description: "Intelligent chatbots that understand context and provide human-like interactions across all your WhatsApp channels."
  },
  {
    icon: Zap,
    title: "Real-time Automation",
    description: "Trigger-based workflows that respond instantly to customer actions, keywords, and behavioral patterns."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless handoffs between AI and human agents with complete conversation context and history."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into conversation performance, conversion rates, and customer satisfaction metrics."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, GDPR compliance, and SOC 2 Type II certification for enterprise peace of mind."
  },
  {
    icon: MessageCircle,
    title: "Multi-Channel Support",
    description: "Connect unlimited WhatsApp numbers with centralized management and cross-channel conversation flows."
  }
]

const testimonials = [
  {
    quote: "WhatsPower transformed our customer support. Response times dropped from hours to seconds.",
    author: "Sarah Chen",
    title: "Head of Operations",
    company: "TechFlow"
  },
  {
    quote: "The AI understands our customers better than our junior reps. Conversion rates up 340%.",
    author: "Marcus Rodriguez",
    title: "VP of Sales", 
    company: "GrowthLab"
  },
  {
    quote: "Finally, a WhatsApp solution that scales with enterprise needs. Flawless integration.",
    author: "Emily Watson",
    title: "CTO",
    company: "InnovateCore"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-lg font-semibold text-zinc-50">WhatsPower</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a>
              <a href="#customers" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Customers</a>
              <a href="/help" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Docs</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-300">
                <Star className="mr-2 h-3 w-3 text-emerald-500" />
                Trusted by 10,000+ teams worldwide
              </div>
            </div>
            
            <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
              WhatsApp automation
              <br />
              <span className="text-emerald-500">for modern teams</span>
            </h1>
            
            <p className="mb-12 text-xl leading-relaxed text-zinc-400 sm:text-2xl">
              Transform customer conversations with AI-powered automation.
              Connect, engage, and convert at scale with the most advanced
              WhatsApp platform for businesses.
            </p>
            
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-3 text-lg">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 text-sm text-zinc-500">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold text-zinc-50 sm:text-5xl">
              Everything you need to scale
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Built for teams who demand more from their WhatsApp automation.
              Professional tools that grow with your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-8 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-zinc-50">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="customers" className="py-32 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold text-zinc-50">
              Loved by teams at
            </h2>
            <p className="text-xl text-zinc-400">
              Join thousands of companies scaling their customer communication
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-8 backdrop-blur-sm"
              >
                <div className="mb-6">
                  <div className="flex text-emerald-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="mb-6 text-lg text-zinc-300 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-zinc-50">{testimonial.author}</div>
                  <div className="text-sm text-zinc-400">
                    {testimonial.title} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-zinc-50 sm:text-5xl">
              Ready to transform your
              <br />
              customer conversations?
            </h2>
            <p className="mb-12 text-xl text-zinc-400 leading-relaxed">
              Join thousands of teams who trust WhatsPower to scale their
              WhatsApp communication. Start your free trial today.
            </p>
            
            <div className="flex flex-col items-center space-y-6 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-zinc-500">
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-8 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-lg font-semibold text-zinc-50">WhatsPower</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link href="/privacy" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Support
              </Link>
            </div>
            
            <div className="text-sm text-zinc-500">
              © 2024 WhatsPower. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}