'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export default function NotFound() {
  const { t, locale } = useTranslation('common')

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-primary mb-4 text-9xl font-bold">404</h1>
        <h2 className="text-foreground mb-4 text-4xl font-bold">
          {t('404:title') || 'Page Not Found'}
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-md text-xl">
          {t('404:description') ||
            "Sorry, we couldn't find the page you're looking for."}
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href={`/${locale}/`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            {t('404:goHome') || 'Go Home'}
          </Link>
          <Link
            href={`/${locale}/listings`}
            className="border-border text-muted-foreground hover:bg-accent rounded-lg border-2 px-6 py-3 font-semibold transition-colors"
          >
            {t('404:browse') || 'Browse Listings'}
          </Link>
        </div>
      </div>
    </div>
  )
}
