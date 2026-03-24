'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Users, 
  Send, 
  TrendingUp, 
  Activity,
  Bot,
  Zap,
  BarChart3,
  ArrowRight,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Target,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Messages',
    value: '12,847',
    change: '+12.3%',
    changeType: 'positive' as const,
    description: 'Last 30 days',
    icon: MessageCircle,
    color: 'text-teal-600'
  },
  {
    title: 'Active Contacts',
    value: '2,341',
    change: '+5.1%',
    changeType: 'positive' as const,
    description: 'In your CRM',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Response Rate',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive' as const,
    description: 'Average response',
    icon: TrendingUp,
    color: 'text-emerald-600'
  },
  {
    title: 'Active Campaigns',
    value: '8',
    change: '+3',
    changeType: 'positive' as const,
    description: 'Running now',
    icon: Target,
    color: 'text-purple-600'
  },
]

const quickActions = [
  {
    title: 'Send Campaign',
    description: 'Create and send messages',
    icon: Send,
    href: '/dashboard/campaigns',
    color: 'bg-teal-50 text-teal-600 hover:bg-teal-100'
  },
  {
    title: 'Add Contacts',
    description: 'Import new contacts',
    icon: Users,
    href: '/dashboard/contacts',
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  },
  {
    title: 'Setup AI Bot',
    description: 'Configure automation',
    icon: Bot,
    href: '/dashboard/whatsapp/bots',
    color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
  },
  {
    title: 'View Analytics',
    description: 'Check performance',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'New message',
    description: 'From +1 (555) 0123 - "Hello, I need help with..."',
    time: '2 min ago',
    status: 'unread',
    avatar: '/api/placeholder/32/32',
    initials: 'JD'
  },
  {
    id: 2,
    type: 'AI Bot Response',
    description: 'Automatically handled customer inquiry',
    time: '5 min ago',
    status: 'success',
    avatar: '/api/placeholder/32/32',
    initials: 'AI'
  },
  {
    id: 3,
    type: 'Campaign Sent',
    description: 'Welcome Series sent to 245 contacts',
    time: '15 min ago',
    status: 'success',
    avatar: '/api/placeholder/32/32',
    initials: 'CS'
  },
  {
    id: 4,
    type: 'Contacts Added',
    description: '12 new contacts imported from CSV',
    time: '1 hour ago',
    status: 'info',
    avatar: '/api/placeholder/32/32',
    initials: 'CA'
  }
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="bg-white">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Link href="/dashboard/campaigns">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-900 mt-1">{stat.title}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                  <div className="flex items-center text-teal-600 text-sm font-medium">
                    Get started
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-500">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-medium flex-shrink-0">
                  {activity.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{activity.type}</p>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-600">{activity.description}</p>
                </div>
                {activity.status === 'unread' && (
                  <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Today's Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Messages Sent</span>
                <span className="text-2xl font-bold text-slate-900">147</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">68% of daily goal</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">AI Responses</span>
                <span className="text-2xl font-bold text-slate-900">89</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">84% automated</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">New Leads</span>
                <span className="text-2xl font-bold text-slate-900">23</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Above average</p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full bg-white">
                  View detailed analytics
                  <BarChart3 className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}