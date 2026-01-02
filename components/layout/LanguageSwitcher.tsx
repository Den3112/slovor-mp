'use client'

import { useTranslation, type Locale } from '@/lib/i18n'
import { FLAGS } from '@/lib/flags'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface LocaleOption {
  code: Locale
  name: string
  flag: string
}

// Language order: SK → CS → EN
const localeOptions: LocaleOption[] = [
  { code: 'sk', name: 'Slovenčina', flag: FLAGS.SK },
  { code: 'cs', name: 'Čeština', flag: FLAGS.CZ },
  { code: 'en', name: 'English', flag: FLAGS.GB },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Guaranteed to have a value due to fallback to localeOptions[2]
  const currentOption =
    localeOptions.find((opt) => opt.code === locale) ||
    localeOptions[2] ||
    ({ code: 'en', name: 'English', flag: '🇬🇧' } as LocaleOption)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded px-2 py-1 text-white transition hover:bg-gray-800"
        aria-label="Change language"
      >
        <span className="text-lg">{currentOption.flag}</span>
        <span className="text-xs font-bold uppercase">
          {currentOption.code}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg duration-200 animate-in fade-in slide-in-from-top-2">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => handleLocaleChange(option.code)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left transition ${
                locale === option.code
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{option.flag}</span>
                <span className="text-xs font-bold uppercase">
                  {option.code}
                </span>
                <span className="text-sm font-medium">{option.name}</span>
              </div>
              {locale === option.code && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
