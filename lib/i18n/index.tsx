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

export type Locale = 'en' | 'sk' | 'cs' | 'ru'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, options?: any) => string
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'slovor-locale'
const LOCALE_COOKIE_KEY = 'slovor-locale'

export function I18nProvider({ children, lang }: { children: ReactNode; lang?: string }) {
  const { t, i18n } = useI18nextTranslation()


  const initialLocale = (lang as Locale) || (i18n.language as Locale) || 'en'
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

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
        ru: 'ru_RU',
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

  // Sync with URL lang prop
  useEffect(() => {
    if (lang && ['en', 'sk', 'cs', 'ru'].includes(lang)) {
      const newLocale = lang as Locale
      if (i18n.language !== newLocale) {
        i18n.changeLanguage(newLocale)
      }
      setLocaleState(newLocale)
      updateHtmlLang(newLocale)
      // Update storage to match URL
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
      document.cookie = `${LOCALE_COOKIE_KEY}=${newLocale}; path=/; max-age=31536000`
    }
  }, [lang, i18n])

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

export function useTranslation(ns?: string | string[]) {
  const context = useContext(I18nContext)
  const { t, i18n } = useI18nextTranslation(ns)

  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }

  return {
    ...context,
    t: (key: string, options?: any) => t(key, options) as string,
    i18n,
  }
}
