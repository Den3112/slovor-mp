'use client'

import { useState, Suspense, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthSocial } from './components/auth-social'
import { AuthForm } from './components/auth-form'
import { useTranslation } from '@/lib/i18n'

function LoginContent() {
  const { t } = useTranslation(['auth', 'common'])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (searchParams?.get('mode') === 'register') {
      setIsRegistering(true)
    }
  }, [searchParams])

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
        err instanceof Error ? err.message : t('auth:unexpectedError')
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
        alert(t('auth:registrationSuccess'))
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
        err instanceof Error ? err.message : t('auth:unexpectedError')

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
    <div className="bg-card relative z-10 w-full max-w-md rounded-xl border border-border p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('auth:backToHome')}</span>
        </Link>
      </div>

      <div className="mb-8 text-center">
        <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg">
          <span className="text-2xl">✨</span>
        </div>
        <h1 className="font-heading text-foreground mb-2 text-2xl font-bold tracking-tight md:text-3xl">
          {isRegistering ? t('auth:joinSlovor') : t('auth:welcomeBack')}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isRegistering
            ? t('auth:signUpSubtitle')
            : t('auth:signInSubtitle')}
        </p>
      </div>

      {error && (
        <div
          className="bg-destructive/10 text-destructive mb-6 rounded-lg border border-destructive/20 p-3 text-sm font-medium"
          data-testid="auth-error-alert"
        >
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
  )
}

export default function LoginPage() {
  const { t } = useTranslation('common')
  return (
    <div className="bg-background relative flex min-h-dvh flex-col items-center justify-center p-4 md:p-8">
      <Suspense
        fallback={
          <div className="text-primary text-center font-bold">{t('loading')}</div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  )
}
