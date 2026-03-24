import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  MessageCircle, 
  Bot, 
  Users, 
  Zap,
  Check,
  Star,
  Play
} from 'lucide-react'

// Stats simples - como EventPass360
const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '2.5M', label: 'Messages Sent' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 2s', label: 'Response Time' }
]

// Features simples - como EventPass360
const features = [
  {
    icon: Bot,
    title: 'AI Automation',
    description: 'Smart chatbots that understand context'
  },
  {
    icon: MessageCircle,
    title: 'Multi-Channel',
    description: 'Connect unlimited WhatsApp numbers'
  },
  {
    icon: Users,
    title: 'Contact Management',
    description: 'Advanced CRM with lead scoring'
  },
  {
    icon: Zap,
    title: 'Real-time Campaigns',
    description: 'Launch targeted message campaigns'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header súper simple */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WhatsPower</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-600">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero súper simple - como EventPass360 */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ teams
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            WhatsApp automation
            <br />
            <span className="text-teal-600">for modern teams</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform customer conversations with AI-powered automation.
            Connect, engage, and convert at scale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Free 14-day trial • No credit card required
          </p>
        </div>
      </section>

      {/* Stats - Exactamente como EventPass360 */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Simple como EventPass360 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-gray-600">
              Professional tools that grow with your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border-0">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Simple */}
      <section className="py-16 px-4 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of teams who trust WhatsPower
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-teal-600 mr-1" />
              14-day trial
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-teal-600 mr-1" />
              No setup fees
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}