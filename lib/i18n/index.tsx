'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
// import i18next from 'i18next'
import { useTranslation as useI18nextTranslation } from 'react-i18next'
import '@/packages/i18n/client' // Ensure i18next is initialized

export type Locale = 'en' | 'sk' | 'cs'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, options?: any) => string
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'slovor-locale'
const LOCALE_COOKIE_KEY = 'slovor-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useI18nextTranslation()
  const [locale, setLocaleState] = useState<Locale>((i18n.language as Locale) || 'en')

  // Update HTML lang attribute and meta tags
  const updateHtmlLang = (newLocale: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale

      let metaLang = document.querySelector('meta[property="og:locale"]')
      if (!metaLang) {
        metaLang = document.createElement('meta')
        metaLang.setAttribute('property', 'og:locale')
        document.head.appendChild(metaLang)
      }

      const localeMap: Record<Locale, string> = {
        en: 'en_US',
        sk: 'sk_SK',
        cs: 'cs_CZ',
      }
      metaLang.setAttribute('content', localeMap[newLocale])

      let contentLang = document.querySelector(
        'meta[http-equiv="content-language"]'
      )
      if (!contentLang) {
        contentLang = document.createElement('meta')
        contentLang.setAttribute('http-equiv', 'content-language')
        document.head.appendChild(contentLang)
      }
      contentLang.setAttribute('content', newLocale)
    }
  }

  useEffect(() => {
    const initLocale = async () => {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
      if (stored && ['en', 'sk', 'cs'].includes(stored)) {
        if (i18n.language !== stored) {
          await i18n.changeLanguage(stored)
        }
        setLocaleState(stored)
        updateHtmlLang(stored)
      }
    }
    initLocale()
  }, [i18n])

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale)
    await i18n.changeLanguage(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    document.cookie = `${LOCALE_COOKIE_KEY}=${newLocale}; path=/; max-age=31536000`
    updateHtmlLang(newLocale)
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: (key: string, options?: any) => t(key, options) as string,
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
