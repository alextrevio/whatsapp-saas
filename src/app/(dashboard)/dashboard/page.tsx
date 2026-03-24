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
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Target
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: 'Total Messages',
    value: '12,847',
    change: '+12.3%',
    changeType: 'positive' as const,
    description: 'Last 30 days',
    icon: MessageCircle
  },
  {
    name: 'Active Contacts',
    value: '2,341',
    change: '+5.1%',
    changeType: 'positive' as const,
    description: 'In your CRM',
    icon: Users
  },
  {
    name: 'Response Rate',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive' as const,
    description: 'Average this month',
    icon: TrendingUp
  },
  {
    name: 'Campaigns Active',
    value: '8',
    change: '+3',
    changeType: 'positive' as const,
    description: 'Currently running',
    icon: Target
  },
]

const quickActions = [
  {
    title: 'Create Campaign',
    description: 'Launch a new message campaign',
    icon: Send,
    href: '/dashboard/campaigns',
    primary: true
  },
  {
    title: 'Add Contacts',
    description: 'Import or create new contacts',
    icon: Users,
    href: '/dashboard/contacts'
  },
  {
    title: 'Setup AI Bot',
    description: 'Configure automated responses',
    icon: Bot,
    href: '/dashboard/whatsapp/bots'
  },
  {
    title: 'View Analytics',
    description: 'Check performance metrics',
    icon: BarChart3,
    href: '/dashboard/analytics'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'message',
    title: 'New message received',
    description: 'From +1 (555) 0123 - "Hello, I need information about..."',
    time: '2 minutes ago',
    status: 'unread' as const,
    icon: MessageCircle
  },
  {
    id: 2,
    type: 'bot',
    title: 'AI bot responded',
    description: 'Bot "Sales Assistant" handled customer inquiry automatically',
    time: '5 minutes ago',
    status: 'success' as const,
    icon: Bot
  },
  {
    id: 3,
    type: 'campaign',
    title: 'Campaign sent',
    description: '"Welcome Series" sent to 245 contacts',
    time: '15 minutes ago',
    status: 'success' as const,
    icon: Send
  },
  {
    id: 4,
    type: 'contact',
    title: 'New contacts added',
    description: '12 contacts imported from CSV file',
    time: '1 hour ago',
    status: 'info' as const,
    icon: Users
  }
]

const campaigns = [
  {
    id: 1,
    name: 'Welcome Series',
    status: 'active',
    sent: 1247,
    opened: 892,
    clicked: 234,
    progress: 78
  },
  {
    id: 2,
    name: 'Product Launch',
    status: 'scheduled',
    sent: 0,
    opened: 0,
    clicked: 0,
    progress: 0
  },
  {
    id: 3,
    name: 'Customer Feedback',
    status: 'completed',
    sent: 543,
    opened: 412,
    clicked: 89,
    progress: 100
  }
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Dashboard</h1>
          <p className="text-zinc-400">Welcome back, here's what's happening with your WhatsApp automation.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-zinc-100">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Link href="/dashboard/campaigns">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <stat.icon className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-zinc-50">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-500' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </div>
                  <p className="text-xs text-zinc-500">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-50">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className={`border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:bg-zinc-800/30 cursor-pointer ${
                action.primary ? 'ring-1 ring-emerald-500/20' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <action.icon className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-50">{action.title}</h3>
                  <p className="mb-4 text-sm text-zinc-400">{action.description}</p>
                  <div className="flex items-center text-emerald-500">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-zinc-50">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 rounded-lg p-3 hover:bg-zinc-800/30 transition-colors">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    activity.status === 'unread' ? 'bg-blue-500/10' :
                    activity.status === 'success' ? 'bg-emerald-500/10' :
                    'bg-zinc-700/50'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.status === 'unread' ? 'text-blue-400' :
                      activity.status === 'success' ? 'text-emerald-500' :
                      'text-zinc-400'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-50">{activity.title}</p>
                      <div className="flex items-center text-zinc-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="text-xs">{activity.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Overview */}
        <Card className="border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-zinc-50">Campaigns</CardTitle>
            <Link href="/dashboard/campaigns">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-lg border border-zinc-800/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-zinc-50">{campaign.name}</h3>
                    <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                      campaign.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-zinc-700/50 text-zinc-400'
                    }`}>
                      <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        campaign.status === 'active' ? 'bg-emerald-500' :
                        campaign.status === 'scheduled' ? 'bg-blue-400' :
                        'bg-zinc-400'
                      }`} />
                      {campaign.status}
                    </div>
                  </div>
                  
                  <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Sent</p>
                      <p className="font-medium text-zinc-50">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Opened</p>
                      <p className="font-medium text-zinc-50">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Clicked</p>
                      <p className="font-medium text-zinc-50">{campaign.clicked.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {campaign.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-zinc-50">{campaign.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/dashboard/campaigns">
                <Button variant="outline" className="w-full border-zinc-800 text-zinc-400 hover:text-zinc-100">
                  View all campaigns
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}