'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, type Locale, type TranslationKeys } from './translations'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'slovor-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default to English
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  // Initialize locale from localStorage or browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
      if (stored && translations[stored]) {
        setLocaleState(stored)
        updateHtmlLang(stored)
      } else {
        // Detect browser language
        const browserLang = navigator.language.split('-')[0] as Locale
        if (translations[browserLang]) {
          setLocaleState(browserLang)
          updateHtmlLang(browserLang)
        } else {
          // Fallback to English if browser language not supported
          setLocaleState('en')
          updateHtmlLang('en')
        }
      }
    } catch (error) {
      // Ignore localStorage errors, keep English as default
      console.warn('Failed to load locale from storage:', error)
    }
    setMounted(true)
  }, [])

  const updateHtmlLang = (newLocale: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
      // Also update meta tags for better SEO
      let metaLang = document.querySelector('meta[property="og:locale"]')
      if (!metaLang) {
        metaLang = document.createElement('meta')
        metaLang.setAttribute('property', 'og:locale')
        document.head.appendChild(metaLang)
      }
      const localeMap: Record<Locale, string> = {
        sk: 'sk_SK',
        cs: 'cs_CZ',
        en: 'en_US',
      }
      metaLang.setAttribute('content', localeMap[newLocale])
    }
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
      updateHtmlLang(newLocale)
    } catch (error) {
      console.warn('Failed to save locale to storage:', error)
    }
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translations[locale] as TranslationKeys,
  }

  // Return children immediately but with default locale until mounted
  // This prevents hydration mismatch
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
