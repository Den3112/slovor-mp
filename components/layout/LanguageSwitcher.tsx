'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation, type Locale } from '@/lib/i18n'
import Image from 'next/image'

// Available locales
const locales: Locale[] = ['sk', 'cs', 'en']

// Locale display names
const localeNames: Record<Locale, string> = {
    en: 'English',
    sk: 'Slovenčina',
    cs: 'Čeština',
}

// SVG Flags
const flags: Record<Locale, string> = {
    en: '/flags/en.svg',
    sk: '/flags/sk.svg',
    cs: '/flags/cs.svg',
}

export function LanguageSwitcher() {
    const { locale, setLocale } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (newLocale: Locale) => {
        setLocale(newLocale)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition rounded hover:bg-gray-800 border border-transparent hover:border-gray-700"
            >
                <div className="relative w-5 h-3.5 rounded-sm overflow-hidden shadow-sm">
                    <Image
                        src={flags[locale]}
                        alt={localeNames[locale]}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="hidden sm:inline">{localeNames[locale]}</span>
                <svg
                    className={`w-3 h-3 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => handleSelect(loc)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                locale === loc ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                        >
                            <div className="relative w-5 h-3.5 rounded-sm overflow-hidden shadow-sm">
                                <Image
                                    src={flags[loc]}
                                    alt={localeNames[loc]}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span>{localeNames[loc]}</span>
                            {locale === loc && (
                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
