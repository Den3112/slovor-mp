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
          },
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
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'

      // Log Failure
      fetch('/api/auth/log-access', {
        method: 'POST',
        body: JSON.stringify({
          status: 'failure',
          failure_reason: errorMessage,
          email: email, // Log the email that was attempted
          event_type: 'login',
        }),
      }).catch(console.error)

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <Suspense
        fallback={
          <div className="text-primary text-center font-bold">Loading...</div>
        }
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] animate-pulse rounded-full bg-indigo-500/10 blur-[100px] md:h-[600px] md:w-[600px] md:blur-[150px]" />
          <div className="absolute bottom-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px] md:h-[600px] md:w-[600px] md:blur-[150px]" />
        </div>

        <div className="glass-card animate-in fade-in zoom-in-95 relative z-10 w-full max-w-md rounded-[2.5rem] p-6 duration-500 md:p-10">
          <Link
            href="/"
            className="mb-8 inline-flex items-center rounded-full border border-indigo-500/10 bg-indigo-500/5 px-5 py-2.5 text-sm font-bold text-indigo-600 transition-all hover:scale-105 hover:bg-indigo-500/10 active:scale-95 dark:text-indigo-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>

          <div className="mb-10 text-center">
            <div className="text-primary mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 shadow-inner md:h-20 md:w-20">
              <span className="animate-bounce-subtle text-3xl md:text-4xl">
                ✨
              </span>
            </div>
            <h1 className="font-heading text-foreground mb-3 text-3xl font-black tracking-tight italic md:text-4xl">
              {isRegistering ? 'Join Slovor' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium md:text-base">
              {isRegistering
                ? "Join Slovakia's premium marketplace"
                : 'Sign in to your premium account'}
            </p>
          </div>

          {error && (
            <div className="shake border-destructive/20 bg-destructive/10 text-destructive animate-in mb-6 rounded-2xl border p-4 text-sm font-bold">
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
