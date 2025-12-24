'use client'

import { I18nProvider } from '@/lib/i18n'
import { LocaleSelector } from '@/components/locale/LocaleSelector'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <LocaleSelector />
            {children}
        </I18nProvider>
    )
}
