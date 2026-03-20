'use client'

import { I18nProvider } from '@/lib/i18n'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { CurrencyProvider } from '@/components/providers/currency-provider'
import { VantageProvider } from '@/components/providers/vantage-provider'
import { Toaster } from '@/components/ui/sonner'
import { useEffect } from 'react'

import { QueryProvider } from '@/components/providers/query-provider'

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
                {children}
                <Toaster />
              </I18nProvider>
            </VantageProvider>
          </CurrencyProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
