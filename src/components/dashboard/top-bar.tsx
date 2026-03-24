'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Menu, Bell, Moon, Sun, User, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.email?.split('@')[0]}
              </span>
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Navegar a perfil
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    signOut()
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close user menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}