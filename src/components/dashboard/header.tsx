'use client'

import { Button } from '@/components/ui/button'
import { 
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  MessageCircle
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-6">
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations, contacts, campaigns..."
              className="w-full rounded-md border border-zinc-800/50 bg-zinc-900/20 py-2 pl-10 pr-4 text-sm text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-emerald-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-900">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-zinc-50">Alejandro Treviño</p>
                <p className="text-xs text-zinc-400">alejandro@example.com</p>
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-zinc-300 focus:text-zinc-50 focus:bg-zinc-800">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-300 focus:text-zinc-50 focus:bg-zinc-800">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-zinc-300 focus:text-zinc-50 focus:bg-zinc-800">
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