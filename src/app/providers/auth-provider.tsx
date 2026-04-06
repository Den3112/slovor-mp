'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { supabase } from '@/shared/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
      if (_event === 'SIGNED_OUT') {
        router.push(`/${lang}/`)
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, lang])

  // Heartbeat: Update last_seen every 5 minutes
  useEffect(() => {
    if (!session?.user) return

    const updateLastSeen = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', session.user.id)
      } catch (error) {
        console.error('Error updating last_seen:', error)
      }
    }

    updateLastSeen() // Initial update
    const interval = setInterval(updateLastSeen, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [session])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.refresh()
  }, [router])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signOut,
    }),
    [session, isLoading, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
