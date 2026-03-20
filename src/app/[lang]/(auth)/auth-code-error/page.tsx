import { Button } from '@/components/ui/button'
import { getTranslationServer } from '@/lib/i18n/server'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await getTranslationServer('auth')

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-card shadow-premium max-w-md rounded-4xl border border-white/10 p-12 text-center">
        <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <AlertCircle
            className="text-destructive h-10 w-10"
            strokeWidth={1.5}
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            Something went wrong during the authentication process. This could
            be due to an expired link or a connection issue.
          </p>
        </div>
        <div className="pt-4">
          <Button asChild className="h-12 w-full">
            <Link href={`/${locale}/login`}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('signIn')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
