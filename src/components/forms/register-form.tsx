'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useTranslation } from '@/packages/i18n/client'
import { signUp } from '../../app/[locale]/(auth)/actions'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, User, UserPlus, Eye, EyeOff, Lock } from 'lucide-react'
import { trackEvent } from '@/lib/utils/analytics'

interface RegisterFormProps {
  locale: string
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const { t } = useTranslation(locale, 'auth')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)

    try {
      const result = await signUp(formData, locale)
      if (result?.error) {
        toast.error(result.error)
      } else {
        trackEvent('auth_signup', { method: 'credentials' })
        setIsSuccess(true)
        toast.success(t('registrationSuccess'))
      }
    } catch (error) {
      toast.error(t('unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card shadow-premium relative w-full max-w-lg space-y-6 overflow-hidden rounded-4xl border border-white/10 p-8 text-center"
      >
        <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <Mail className="text-primary h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">{t('registrationSuccess')}</h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a confirmation link to your email address. Please
          follow the instructions to complete your registration.
        </p>
        <Button asChild className="h-12 w-full">
          <Link href={`/${locale}/login`}>{t('signIn')}</Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card shadow-premium relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/10 p-8"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {t('joinSlovor')}
        </h1>
        <p className="text-muted-foreground">{t('signUpSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="firstName"
                placeholder="John"
                className="pl-10"
                {...register('firstName')}
                disabled={isLoading}
              />
            </div>
            {errors.firstName && (
              <p className="text-destructive text-xs">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="lastName"
                placeholder="Doe"
                className="pl-10"
                {...register('lastName')}
                disabled={isLoading}
              />
            </div>
            {errors.lastName && (
              <p className="text-destructive text-xs">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="email"
                placeholder={t('emailPlaceholder')}
                type="email"
                className="pl-10"
                {...register('email')}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pr-10 pl-10"
                  {...register('password')}
                  disabled={isLoading}
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                disabled={isLoading}
              />
            </div>
          </div>
          {(errors.password || errors.confirmPassword) && (
            <p className="text-destructive text-xs">
              {errors.password?.message || errors.confirmPassword?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="shadow-primary h-12 w-full hover:scale-[1.02] active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            t('loading')
          ) : (
            <>
              {t('signUp')}
              <UserPlus className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          {t('alreadyHaveAccount')}{' '}
          <Link
            href={`/${locale}/login`}
            className="text-primary font-semibold hover:underline"
          >
            {t('signIn')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
