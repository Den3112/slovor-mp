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
                router.push('/')
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
