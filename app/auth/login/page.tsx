'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import { AuthHeader } from './components/auth-header'
import { AuthSocial } from './components/auth-social'
import { AuthForm } from './components/auth-form'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null

  const [isRegistering, setIsRegistering] = useState(
    searchParams?.get('mode') === 'register'
  )
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        // Fire and forget log access
        fetch('/api/auth/log-access', { method: 'POST' }).catch(console.error)

        router.push('/profile')
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'

      // Log Failure
      fetch('/api/auth/log-access', {
        method: 'POST',
        body: JSON.stringify({
          status: 'failure',
          failure_reason: errorMessage,
          email: email, // Log the email that was attempted
          event_type: 'login'
        })
      }).catch(console.error)

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      <Suspense
        fallback={
          <div className="text-center font-bold text-primary">Loading...</div>
        }
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute right-[5%] top-[10%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] animate-pulse bg-primary/20 blur-[100px] md:blur-[150px]" />
          <div className="absolute bottom-[10%] left-[5%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] bg-violet-600/20 blur-[100px] md:blur-[150px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 w-full max-w-md border-2 border-primary/20 bg-background p-6 shadow-2xl md:p-10 duration-500 animate-in fade-in zoom-in-95">
          <AuthHeader isRegistering={isRegistering} />

          {error && (
            <div className="shake mb-8 border-2 border-destructive/20 bg-destructive/10 p-4 font-sans text-xs font-bold uppercase tracking-widest text-destructive animate-in">
              {error}
            </div>
          )}

          <AuthSocial
            onGoogleLogin={handleGoogleLogin}
            googleLoading={googleLoading}
            loading={loading}
          />

          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            googleLoading={googleLoading}
            isRegistering={isRegistering}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            setIsRegistering={setIsRegistering}
          />
        </div>
      </Suspense>
    </div>
  )
}
