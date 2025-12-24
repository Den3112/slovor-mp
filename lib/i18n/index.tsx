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
const LOCALE_DETECTED_KEY = 'slovor-locale-detected'

/**
 * Detect user's locale from browser settings
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  
  // Get all browser languages
  const languages = navigator.languages || [navigator.language]
  
  for (const lang of languages) {
    const code = lang.split('-')[0].toLowerCase() as Locale
    if (translations[code]) {
      return code
    }
  }
  
  return 'en' // Fallback to English
}

/**
 * Detect user's locale from IP geolocation
 */
export async function detectLocaleFromIP(): Promise<Locale | null> {
  try {
    // Using ipapi.co for free IP geolocation
    const response = await fetch('https://ipapi.co/json/', { cache: 'force-cache' })
    if (!response.ok) return null
    
    const data = await response.json()
    const countryCode = data.country_code?.toLowerCase()
    
    // Map country codes to supported locales
    const countryToLocale: Record<string, Locale> = {
      'sk': 'sk',  // Slovakia
      'cz': 'cs',  // Czech Republic
      'us': 'en',  // USA
      'gb': 'en',  // UK
      'au': 'en',  // Australia
      'ca': 'en',  // Canada
    }
    
    return countryToLocale[countryCode] || null
  } catch (error) {
    console.warn('Failed to detect locale from IP:', error)
    return null
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  // Initialize locale from localStorage, IP, or browser
  useEffect(() => {
    async function initializeLocale() {
      try {
        // Check if user has already chosen a locale
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
        if (stored && translations[stored]) {
          setLocaleState(stored)
          updateHtmlLang(stored)
          setMounted(true)
          return
        }

        // Check if we've already detected locale for this user
        const detected = localStorage.getItem(LOCALE_DETECTED_KEY) as Locale | null
        if (detected && translations[detected]) {
          setLocaleState(detected)
          updateHtmlLang(detected)
          setMounted(true)
          return
        }

        // Try to detect from IP first (most accurate)
        const ipLocale = await detectLocaleFromIP()
        if (ipLocale) {
          setLocaleState(ipLocale)
          updateHtmlLang(ipLocale)
          localStorage.setItem(LOCALE_DETECTED_KEY, ipLocale)
          setMounted(true)
          return
        }

        // Fallback to browser language detection
        const browserLocale = detectBrowserLocale()
        setLocaleState(browserLocale)
        updateHtmlLang(browserLocale)
        localStorage.setItem(LOCALE_DETECTED_KEY, browserLocale)
      } catch (error) {
        console.warn('Failed to initialize locale:', error)
        setLocaleState('en')
        updateHtmlLang('en')
      }
      setMounted(true)
    }

    initializeLocale()
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    updateHtmlLang(newLocale)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
      localStorage.setItem(LOCALE_DETECTED_KEY, newLocale)
    } catch (error) {
      console.warn('Failed to save locale to storage:', error)
    }
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translations[locale] as TranslationKeys,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Update HTML lang attribute for better SEO and accessibility
 */
function updateHtmlLang(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}

/**
 * Check if this is user's first visit
 */
export function isFirstVisit(): boolean {
  if (typeof localStorage === 'undefined') return true
  return !localStorage.getItem(LOCALE_STORAGE_KEY)
}

// Re-export for convenience
export { translations }
export type { Locale }
