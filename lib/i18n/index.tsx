'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
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

  // Update HTML lang attribute and meta tags
  const updateHtmlLang = (newLocale: Locale) => {
    if (typeof document !== 'undefined') {
      // Update html lang attribute
      document.documentElement.lang = newLocale
      
      // Update or create og:locale meta tag for SEO
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

      // Update content language meta tag for browser translators
      let contentLang = document.querySelector('meta[http-equiv="content-language"]')
      if (!contentLang) {
        contentLang = document.createElement('meta')
        contentLang.setAttribute('http-equiv', 'content-language')
        document.head.appendChild(contentLang)
      }
      contentLang.setAttribute('content', newLocale)
    }
  }

  // Initialize locale from localStorage or detect from browser/IP
  useEffect(() => {
    const initLocale = async () => {
      try {
        // Check if user has already set a preference
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
        if (stored && translations[stored]) {
          setLocaleState(stored)
          updateHtmlLang(stored)
          return
        }

        // No stored preference - try smart detection
        // First try IP-based detection
        try {
          const response = await fetch('/api/detect-locale')
          if (response.ok) {
            const data = await response.json()
            if (data.locale && translations[data.locale]) {
              setLocaleState(data.locale)
              updateHtmlLang(data.locale)
              return
            }
          }
        } catch (error) {
          console.warn('IP-based locale detection failed:', error)
        }

        // Fallback to browser language
        const browserLang = navigator.language.split('-')[0] as Locale
        if (translations[browserLang]) {
          setLocaleState(browserLang)
          updateHtmlLang(browserLang)
        } else {
          // Final fallback to English
          setLocaleState('en')
          updateHtmlLang('en')
        }
      } catch (error) {
        console.warn('Failed to initialize locale:', error)
        setLocaleState('en')
        updateHtmlLang('en')
      }
    }

    initLocale()
  }, [])

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
