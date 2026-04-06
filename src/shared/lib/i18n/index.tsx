'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react'
import { useTranslation as useI18nextTranslation } from 'react-i18next'
import '@/packages/i18n/client'

export type Locale = 'en' | 'sk' | 'cs'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, options?: any) => string
}

export const I18nContext = createContext<I18nContextValue | undefined>(
  undefined
)

const LANG_STORAGE_KEY = 'slovor-lang'
const LANG_COOKIE_KEY = 'slovor-lang'

export function I18nProvider({
  children,
  lang,
}: {
  children: ReactNode
  lang?: string
}) {
  const { t, i18n } = useI18nextTranslation()

  const initialLocale = (lang as Locale) || 'en'
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  // Update HTML lang attribute and meta tags - MEMOIZED
  const updateHtmlLang = useCallback((newLocale: Locale) => {
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
  }, [])

  // Sync with URL lang prop
  useEffect(() => {
    if (lang && ['en', 'sk', 'cs'].includes(lang)) {
      const newLocale = lang as Locale
      if (i18n.language !== newLocale) {
        i18n.changeLanguage(newLocale)
      }

      // Guard with setTimeout to avoid synchronous state update during render/effect phase
      const timer = setTimeout(() => {
        setLocaleState(newLocale)
        updateHtmlLang(newLocale)
        // Update storage to match URL
        localStorage.setItem(LANG_STORAGE_KEY, newLocale)
        document.cookie = `${LANG_COOKIE_KEY}=${newLocale}; path=/; max-age=31536000`
      }, 0)

      return () => clearTimeout(timer)
    }
    return () => {}
  }, [lang, i18n, updateHtmlLang])

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      setLocaleState(newLocale)
      await i18n.changeLanguage(newLocale)
      localStorage.setItem(LANG_STORAGE_KEY, newLocale)
      document.cookie = `${LANG_COOKIE_KEY}=${newLocale}; path=/; max-age=31536000`
      updateHtmlLang(newLocale)
    },
    [i18n, updateHtmlLang]
  )

  // Stability fix: Callback for the t function from context
  const tFunction = useCallback(
    (key: string, options?: any) => t(key, options) as string,
    [t]
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: tFunction,
    }),
    [locale, setLocale, tFunction]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(ns?: string | string[]) {
  const context = useContext(I18nContext)

  // Decisively memoize namespaces to prevent re-renders when passed as array literal
  const stableNs = useMemo(() => {
    if (Array.isArray(ns)) return ns.slice().sort().join(',')
    return ns
  }, [ns])

  const memoizedNs = useMemo(() => {
    if (typeof stableNs === 'string' && stableNs.includes(','))
      return stableNs.split(',')
    return stableNs
  }, [stableNs])

  const { t: translate, i18n } = useI18nextTranslation(memoizedNs)

  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }

  const t = useCallback(
    (key: string, options?: any) => translate(key, options) as string,
    [translate]
  )

  return useMemo(
    () => ({
      ...context,
      t,
      i18n,
    }),
    [context, t, i18n]
  )
}
