'use client'

import { I18nProvider } from '@/lib/i18n'
import { LocaleDetector } from '@/components/locale/LocaleDetector'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LocaleDetector />
      {children}
    </I18nProvider>
  )
}
