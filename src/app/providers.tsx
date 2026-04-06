'use client'

import { I18nProvider } from '@/shared/lib/i18n'
import { AuthProvider } from '@/app/providers/auth-provider'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { CurrencyProvider } from '@/app/providers/currency-provider'
import { VantageProvider } from '@/app/providers/vantage-provider'
import { Toaster } from '@/shared/ui/sonner'
import { useEffect } from 'react'

import { QueryProvider } from '@/app/providers/query-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({
  children,
  lang,
}: {
  children: React.ReactNode
  lang?: string
}) {
  // Clear localStorage for welcome modal on dev (for testing)
  useEffect(() => {
    // Uncomment to reset welcome modal for testing:
    // localStorage.removeItem('slovor-welcome-shown')
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="slovor-theme"
    >
      <QueryProvider>
        <AuthProvider>
          <CurrencyProvider>
            <VantageProvider>
              <I18nProvider lang={lang}>
                {/* Welcome modal disabled mostly for dev annoyance reduction, uncomment in prod */}
                {/* <LocaleWelcomeModal /> */}
                <NuqsAdapter>{children}</NuqsAdapter>
                <Toaster />
              </I18nProvider>
            </VantageProvider>
          </CurrencyProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
