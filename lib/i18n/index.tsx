'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Locale, Translations } from './types'
export type { Locale, Translations }

// Import translations
import en from './locales/en.json'
import sk from './locales/sk.json'
import cs from './locales/cs.json'

const translations: Record<Locale, Translations> = {
    en: en as Translations,
    sk: sk as Translations,
    cs: cs as Translations,
}

// Locale display names
export const localeNames: Record<Locale, string> = {
    en: 'English',
    sk: 'Slovenčina',
    cs: 'Čeština',
}

// Locale flags
export const localeFlags: Record<Locale, string> = {
    en: '🇬🇧',
    sk: '🇸🇰',
    cs: '🇨🇿',
}

// Default locale
export const defaultLocale: Locale = 'en'

// Context
interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: Translations
}

const I18nContext = createContext<I18nContextType | null>(null)

// Provider
interface I18nProviderProps {
    children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale)
    const [mounted, setMounted] = useState(false)

    // Load saved locale from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('slovor-locale') as Locale | null
        if (saved && translations[saved]) {
            setLocaleState(saved)
        }
        setMounted(true)
    }, [])

    // Save locale to localStorage when changed
    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem('slovor-locale', newLocale)
    }

    const t = translations[locale]

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return <>{children}</>
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}

// Hook
export function useTranslation() {
    const context = useContext(I18nContext)
    if (!context) {
        // Return default translations if used outside provider
        return {
            locale: defaultLocale,
            setLocale: () => { },
            t: translations[defaultLocale],
        }
    }
    return context
}

// Get translation by key path (e.g., 'common.search')
export function useT(path: string): string {
    const { t } = useTranslation()
    const keys = path.split('.')
    let result: any = t
    for (const key of keys) {
        result = result?.[key]
    }
    return result || path
}

// Export all locales for iteration
export const locales: Locale[] = ['en', 'sk', 'cs']
