'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, type Locale } from './translations'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations.en
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'slovor-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('sk')
  const [mounted, setMounted] = useState(false)

  // Initialize locale from localStorage or browser
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (stored && translations[stored]) {
      setLocaleState(stored)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Locale
      if (translations[browserLang]) {
        setLocaleState(browserLang)
      }
    }
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translations[locale] || translations.sk,
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}

// Re-export for convenience
export { translations }
export type { Locale }
