import { LoginForm } from '@/components/forms/login-form'
import { getTranslation as getTranslations } from '@/packages/i18n/server'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslations(locale, 'auth')

  return {
    title: t('login.title'),
    description: t('login.description'),
  }
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Aurora */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden">
        <div className="bg-primary/20 absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-indigo-500/10 blur-[120px] delay-700" />
      </div>

      <div className="relative w-full max-w-md space-y-8">
        <LoginForm locale={locale} />
      </div>
    </div>
  )
}
