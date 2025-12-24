'use client'

import { TranslationProvider } from '@/lib/i18n/TranslationProvider'
import { LocaleWelcomeModal } from '@/components/locale/LocaleWelcomeModal'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Clear localStorage for welcome modal on dev (for testing)
  useEffect(() => {
    // Uncomment to reset welcome modal for testing:
    // localStorage.removeItem('slovor-welcome-shown')
  }, [])

  return (
    <TranslationProvider>
      <LocaleWelcomeModal />
      {children}
    </TranslationProvider>
  )
}
