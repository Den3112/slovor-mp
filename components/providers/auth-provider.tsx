'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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
  signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  console.log('AuthProvider: RENDER. URL:', process.env.NEXT_PUBLIC_SUPABASE_URL, 'Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Session retrieved', !!session);
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
        router.push('/')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

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

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, isLoading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
