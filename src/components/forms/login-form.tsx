'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useTranslation } from '@/packages/i18n/client'
import { signIn } from '@/app/[lang]/(auth)/actions'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from 'lucide-react'
import { trackEvent } from '@/lib/utils/analytics'

interface LoginFormProps {
  lang: string
}

export function LoginForm({ lang }: LoginFormProps) {
  const { t } = useTranslation(lang, 'auth')
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

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    try {
      const result = await signIn(formData, lang)
      if (result?.error) {
        toast.error(result.error)
      } else {
        trackEvent('auth_login', { method: 'credentials' })
        toast.success(t('welcomeBack'))
        router.push(`/${lang}/dashboard`)
        router.refresh()
      }
    } catch (error) {
      toast.error(t('unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card shadow-premium relative w-full max-w-md overflow-hidden rounded-4xl border border-white/10 p-8"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {t('welcomeBack')}
        </h1>
        <p className="text-muted-foreground">{t('signInSubtitle')}</p>
      </div>

      <div className="grid gap-4">
        <Button variant="outline" className="h-12 gap-2" disabled={isLoading}>
          <Chrome className="h-5 w-5" />
          {t('googleSignIn')}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              {t('orContinueWith')}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="email"
                placeholder={t('emailPlaceholder')}
                type="email"
                autoComplete="email"
                className="pl-10"
                {...register('email')}
                disabled={isLoading}
                data-testid="auth-email-input"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('password')}</Label>
              <Link
                href={`/${lang}/forgot-password`}
                className="text-primary text-xs hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="pr-10 pl-10"
                {...register('password')}
                disabled={isLoading}
                data-testid="auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                disabled={isLoading}
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
          data-testid="auth-submit-btn"
        >
          {isLoading ? (
            t('loading')
          ) : (
            <>
              {t('signIn')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          {t('dontHaveAccount')}{' '}
          <Link
            href={`/${lang}/register`}
            className="text-primary font-semibold hover:underline"
          >
            {t('signUp')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
