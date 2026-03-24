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
  ChevronRight,
  Play
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: "AI-Powered Automation",
    description: "Intelligent chatbots that understand context and provide human-like responses to your customers 24/7."
  },
  {
    icon: MessageCircle,
    title: "Multi-Channel Support",
    description: "Connect unlimited WhatsApp numbers with centralized management and unified inbox experience."
  },
  {
    icon: Users,
    title: "Smart Contact Management",
    description: "Advanced CRM with contact segmentation, tagging, and automated lead scoring capabilities."
  },
  {
    icon: Zap,
    title: "Real-time Campaigns",
    description: "Launch targeted message campaigns with advanced scheduling and personalization features."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into conversation performance, response rates, and customer engagement metrics."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, GDPR compliance, and enterprise-grade security for your business data."
  }
]

const testimonials = [
  {
    quote: "WhatsPower increased our response rate by 340% and cut support costs in half.",
    author: "Sarah Chen",
    title: "Head of Customer Success",
    company: "TechFlow",
    avatar: "SC"
  },
  {
    quote: "The AI understands our customers better than our junior team members. Incredible results.",
    author: "Marcus Rodriguez", 
    title: "VP of Sales",
    company: "GrowthLab",
    avatar: "MR"
  },
  {
    quote: "Finally, a WhatsApp solution that scales with enterprise needs. Seamless integration.",
    author: "Emily Watson",
    title: "CTO",
    company: "InnovateCore", 
    avatar: "EW"
  }
]

const stats = [
  { label: "Messages sent daily", value: "2.5M+" },
  { label: "Response time", value: "< 2 sec" },
  { label: "Customer satisfaction", value: "98.5%" },
  { label: "Active businesses", value: "10,000+" }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">WhatsPower</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">Pricing</a>
              <a href="#customers" className="text-sm font-medium text-slate-600 hover:text-slate-900">Customers</a>
              <a href="/help" className="text-sm font-medium text-slate-600 hover:text-slate-900">Help</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
                <Star className="mr-2 h-3 w-3" />
                Trusted by 10,000+ teams worldwide
              </div>
            </div>
            
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              WhatsApp automation
              <br />
              <span className="text-teal-600">for modern teams</span>
            </h1>
            
            <p className="mb-10 text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Transform customer conversations with AI-powered automation.
              Connect, engage, and convert at scale with the most advanced
              WhatsApp platform for businesses.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-base">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-slate-500">
              Free 14-day trial • No credit card required • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900 sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to scale
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Built for teams who demand more from their WhatsApp automation.
              Professional tools that grow with your business.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                      <feature.icon className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-7">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="py-20 bg-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Loved by teams worldwide
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Join thousands of companies scaling their customer communication
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-8"
              >
                <div className="mb-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-teal-600 text-teal-600" />
                  ))}
                </div>
                <blockquote className="mb-6 text-lg font-medium leading-8 text-slate-900">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600">
                    <span className="text-sm font-medium text-white">{testimonial.avatar}</span>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-600">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Ready to transform your customer conversations?
            </h2>
            <p className="mb-10 text-lg leading-8 text-slate-600">
              Join thousands of teams who trust WhatsPower to scale their
              WhatsApp communication. Start your free trial today.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-teal-600" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-teal-600" />
                  No setup fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">WhatsPower</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link href="/privacy" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Terms of Service
              </Link>
              <Link href="/help" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Support
              </Link>
            </div>
            
            <div className="text-sm text-slate-500">
              © 2024 WhatsPower. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}