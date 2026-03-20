'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { Container } from '@/components/ui/container'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error Boundary Caught:', error)
  }, [error])

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center p-4">
      <div className="bg-destructive/10 relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl">
        <div className="bg-destructive/20 absolute inset-0 animate-ping rounded-2xl" />
        <AlertCircle className="text-destructive relative z-10 h-12 w-12" />
      </div>

      <h2 className="text-foreground font-heading mb-3 text-center text-2xl font-bold tracking-tight md:text-3xl">
        {t('common:errorOccurred') || 'Something went wrong'}
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md text-center text-sm leading-relaxed">
        {t('common:dashboardErrorDesc') ||
          'We encountered an unexpected issue while loading your dashboard. Please try refreshing.'}
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 h-12 gap-2 rounded-xl px-8 font-bold shadow-lg transition-all active:scale-95"
        >
          <RefreshCcw className="h-4 w-4" />
          {t('common:tryAgain') || 'Try again'}
        </Button>
      </div>
    </Container>
  )
}
