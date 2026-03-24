'use client'

import { createContext, useContext } from 'react'
import { ThemeProvider } from 'next-themes'

interface AuthContextType {
  user: { email: string; user_metadata?: any } | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: { email: 'alejandro@interno.com', user_metadata: { full_name: 'Alejandro' } },
  loading: false,
  signOut: async () => {}
})

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const authValue = {
    user: { email: 'alejandro@interno.com', user_metadata: { full_name: 'Alejandro' } },
    loading: false,
    signOut: async () => {}
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}