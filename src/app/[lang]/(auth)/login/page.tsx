'use client'

import { Suspense } from 'react'
import { useTranslation } from '@/lib/i18n'
import { useParams, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/forms/login-form'
import { RegisterForm } from '@/components/forms/register-form'
import { motion, AnimatePresence } from 'framer-motion'

function LoginContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const lang = params.lang as string
  const mode = searchParams.get('mode')
  const isRegistering = mode === 'register'

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {isRegistering ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RegisterForm lang={lang} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <LoginForm lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LoginPage() {
  const { t } = useTranslation('common')

  return (
    <div className="bg-background relative flex min-h-dvh flex-col items-center justify-center p-4 md:p-8">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[25%] -left-[10%] h-[50%] w-[50%] rounded-full blur-[120px]" />
        <div className="bg-primary/5 absolute -right-[10%] -bottom-[25%] h-[50%] w-[50%] rounded-full blur-[120px]" />
      </div>

      <Suspense
        fallback={
          <div className="text-primary text-center font-bold">
            {t('loading')}
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  )
}
