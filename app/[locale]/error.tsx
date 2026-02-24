'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation(['common'])

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <div className="bg-destructive/10 text-destructive border-destructive/20 flex h-20 w-20 items-center justify-center rounded-2xl border-2 shadow-lg">
        <AlertCircle className="h-10 w-10" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold tracking-tight uppercase">
          {t('common:error.title') || 'Something went wrong!'}
        </h2>
        <p className="text-muted-foreground font-medium">
          {t('common:error.description') ||
            'We apologize for the inconvenience. Our team has been notified.'}
        </p>
        <p className="text-muted-foreground/50 bg-muted inline-block rounded-md px-2 py-1 font-mono text-xs">
          {error.digest}
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          size="lg"
          className="font-bold tracking-widest uppercase shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('common:error.retry') || 'Try again'}
        </Button>
      </div>
    </div>
  )
}
