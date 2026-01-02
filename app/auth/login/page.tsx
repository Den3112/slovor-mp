'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null
  const [isRegistering, setIsRegistering] = useState(
    searchParams?.get('mode') === 'register'
  )
  const router = useRouter()

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
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <Suspense
        fallback={
          <div className="text-center font-bold text-primary">Loading...</div>
        }
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute right-[10%] top-[20%] h-[300px] w-[300px] animate-pulse rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[20%] left-[10%] h-[300px] w-[300px] rounded-full bg-violet-600/20 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/50 bg-card p-8 shadow-2xl duration-500 animate-in fade-in zoom-in-95">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>

          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="mb-2 font-heading text-3xl font-black tracking-tight">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isRegistering
                ? 'Join the #1 marketplace in Slovakia'
                : 'Sign in to manage your listings'}
            </p>
          </div>

          {error && (
            <div className="shake mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive animate-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-foreground/80">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-foreground/80">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 h-12 w-full rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isRegistering ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {isRegistering
                ? 'Already have an account?'
                : "Don't have an account?"}
            </span>{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-bold text-primary hover:underline"
            >
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
