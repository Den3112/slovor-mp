'use client'

import { useState, useEffect } from 'react'
import { useTranslation, isFirstVisit } from '@/lib/i18n'
import { X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LOCALE_MODAL_DISMISSED = 'slovor-locale-modal-dismissed'

export function LocaleSelector() {
  const { locale, setLocale, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Show modal only on first visit and if not dismissed
    const dismissed = localStorage.getItem(LOCALE_MODAL_DISMISSED)
    if (isFirstVisit() && !dismissed) {
      // Small delay to avoid jarring appearance
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSelectLocale = (selectedLocale: typeof locale) => {
    setLocale(selectedLocale)
    setIsOpen(false)
    localStorage.setItem(LOCALE_MODAL_DISMISSED, 'true')
  }

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem(LOCALE_MODAL_DISMISSED, 'true')
  }

  if (!mounted || !isOpen) return null

  const locales = [
    { code: 'sk' as const, name: 'Slovenčina', flag: '🇸🇰', country: 'Slovensko' },
    { code: 'cs' as const, name: 'Čeština', flag: '🇨🇿', country: 'Česká republika' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧', country: 'International' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleDismiss}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-12 pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <Globe className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">
            Choose Your Language
          </h2>
          <p className="text-gray-600 text-center mb-8">
            We detected you might prefer one of these languages
          </p>

          {/* Language options */}
          <div className="space-y-3 mb-6">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleSelectLocale(loc.code)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  locale === loc.code
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-4xl">{loc.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-bold text-gray-900 text-lg">{loc.name}</div>
                  <div className="text-sm text-gray-500">{loc.country}</div>
                </div>
                {locale === loc.code && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <Button
            onClick={() => handleSelectLocale(locale)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold text-lg shadow-lg"
          >
            Continue with {locales.find(l => l.code === locale)?.name}
          </Button>

          {/* Info text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            You can change the language anytime from the header menu
          </p>
        </div>
      </div>
    </>
  )
}
