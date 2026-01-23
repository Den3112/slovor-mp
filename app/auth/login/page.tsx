'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
          <div className="absolute right-[10%] top-[20%] h-[400px] w-[400px] md:h-[600px] md:w-[600px] animate-pulse rounded-full bg-indigo-500/10 blur-[100px] md:blur-[150px]" />
          <div className="absolute bottom-[20%] left-[10%] h-[400px] w-[400px] md:h-[600px] md:w-[600px] rounded-full bg-violet-600/10 blur-[100px] md:blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-md glass-card rounded-[2.5rem] p-6 md:p-10 duration-500 animate-in fade-in zoom-in-95">
          <Link
            href="/"
            className="mb-8 inline-flex items-center rounded-full bg-indigo-500/5 border border-indigo-500/10 px-5 py-2.5 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-500/10 hover:scale-105 active:scale-95 dark:text-indigo-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>

          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-primary shadow-inner border border-white/20">
              <span className="text-3xl md:text-4xl animate-bounce-subtle">✨</span>
            </div>
            <h1 className="mb-3 font-heading text-3xl md:text-4xl font-black tracking-tight text-foreground italic">
              {isRegistering ? 'Join Slovor' : 'Welcome Back'}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              {isRegistering
                ? 'Join Slovakia\'s premium marketplace'
                : 'Sign in to your premium account'}
            </p>
          </div>

          {error && (
            <div className="shake mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive animate-in">
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
