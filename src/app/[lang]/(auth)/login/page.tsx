'use client'

import { Suspense, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from '@/features/auth'

function LoginContent() {
  const params = useParams()
  const lang = (params.lang || 'en') as string
  const [showForm] = useState(true)

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait">
        {showForm && (
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
  const { t } = useTranslation(['common', 'auth'])

  return (
    <div className="bg-background relative flex min-h-[60vh] flex-col items-center justify-center p-4 md:p-8">
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
