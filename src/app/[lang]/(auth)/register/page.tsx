'use client'

import { Suspense } from 'react'
import { useTranslation } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { RegisterForm } from '@/components/forms/register-form'

function RegisterContent() {
  const params = useParams()
  const lang = params.lang as string

  return (
    <div className="w-full max-w-md">
      <RegisterForm lang={lang} />
    </div>
  )
}

export default function RegisterPage() {
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
        <RegisterContent />
      </Suspense>
    </div>
  )
}
