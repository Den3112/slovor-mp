'use client'

import { I18nProvider } from '@/lib/i18n'
import { LocaleWelcomeModal } from '@/components/locale/LocaleWelcomeModal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LocaleWelcomeModal />
      {children}
    </I18nProvider>
  )
}
