'use client'

import { Button } from '@/components/ui/button'
import { 
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  MessageCircle,
  HelpCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations, contacts..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          
          {/* Help */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-teal-600 rounded-full"></span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100">
                <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">AT</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-slate-200 bg-white shadow-lg">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-slate-900">Alejandro Treviño</p>
                <p className="text-xs text-slate-500">alejandro@example.com</p>
              </div>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuItem className="text-slate-700 focus:text-slate-900 focus:bg-slate-100 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-700 focus:text-slate-900 focus:bg-slate-100 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuItem className="text-slate-700 focus:text-slate-900 focus:bg-slate-100 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}