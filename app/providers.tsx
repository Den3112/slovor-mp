'use client'

import { I18nProvider } from '@/lib/i18n'
import { AuthProvider } from '@/components/providers/auth-provider'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Clear localStorage for welcome modal on dev (for testing)
  useEffect(() => {
    // Uncomment to reset welcome modal for testing:
    // localStorage.removeItem('slovor-welcome-shown')
  }, [])

  return (
    <AuthProvider>
      <I18nProvider>
        {/* Welcome modal disabled mostly for dev annoyance reduction, uncomment in prod */}
        {/* <LocaleWelcomeModal /> */}
        {children}
      </I18nProvider>
    </AuthProvider>
  )
}
