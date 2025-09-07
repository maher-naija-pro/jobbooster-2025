'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
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

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    // Immediately clear local state
    setUser(null)
    setSession(null)
  }, [supabase.auth])

  const refreshAuth = useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)
  }, [supabase.auth])

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

        // Only update state if values have actually changed
        const newUser = session?.user ?? null
        const newSession = session

        setSession(prevSession => {
          if (prevSession?.access_token === newSession?.access_token) {
            return prevSession
          }
          return newSession
        })

        setUser(prevUser => {
          if (prevUser?.id === newUser?.id) {
            return prevUser
          }
          return newUser
        })

        setLoading(false)
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

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signOut,
    refreshAuth,
  }), [user, session, loading, signOut, refreshAuth])

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
