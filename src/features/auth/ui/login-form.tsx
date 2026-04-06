'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/shared/lib/validations/auth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { signIn, signInWithGoogle } from '@/app/[lang]/(auth)/actions'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from 'lucide-react'
import { trackEvent } from '@/shared/lib/utils/analytics'

interface LoginFormProps {
  lang: string
}

export function LoginForm({ lang }: LoginFormProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      console.log('Google Sign In clicked')
      await signInWithGoogle()
    } catch (error) {
      console.error('Google Sign In error:', error)
      toast.error(t('unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    console.log('Email Sign In clicked', data.email)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    try {
      const result = await signIn(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        trackEvent('auth_login', { method: 'credentials' })
        toast.success(t('welcomeBack'))
        router.push(`/${lang}/dashboard`)
        router.refresh()
      }
    } catch (error) {
      console.error('Email Sign In error:', error)
      toast.error(t('unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 border-border/50 grid w-full gap-8 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('welcomeBack') || 'Welcome back'}
        </h1>
        <p className="text-muted-foreground">
          {t('signInSubtitle') || 'Sign in to your account'}
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          variant="outline"
          className="h-12 gap-2"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          type="button"
        >
          <Chrome className="h-5 w-5" />
          {t('googleSignIn') || 'Continue with Google'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              {t('orContinueWith') || 'Or continue with email'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email') || 'Email Address'}</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                {...register('email')}
                id="email"
                placeholder={t('emailPlaceholder') || 'name@example.com'}
                type="email"
                autoComplete="email"
                className="h-11 pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('password') || 'Password'}</Label>
              <Link
                href={`/${lang}/forgot-password`}
                className="text-primary text-xs hover:underline"
              >
                {t('forgotPassword') || 'Forgot Password?'}
              </Link>
            </div>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="h-11 px-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="shadow-primary h-12 w-full hover:scale-[1.02] active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            t('loading') || 'Loading...'
          ) : (
            <>
              {t('signIn') || 'Sign In'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          {t('dontHaveAccount') || "Don't have an account?"}{' '}
          <Link
            href={`/${lang}/register`}
            className="text-primary font-semibold hover:underline"
          >
            {t('signUp') || 'Sign Up'}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
