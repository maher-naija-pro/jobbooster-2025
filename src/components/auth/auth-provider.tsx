'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)

        // Always update the state for any auth change
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Force a re-render by updating state even if values are the same
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
        }
      }
    )

    // Also refresh auth state when window regains focus
    // This helps catch auth changes that might have happened in other tabs
    const handleFocus = () => {
      getSession()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('focus', handleFocus)
    }
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshAuth = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)
  }

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
