'use client'

import { useEffect, useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'
import { useTranslation, type Locale } from '@/lib/i18n'
import { FLAGS, PARTY } from '@/lib/flags'

const WELCOME_SHOWN_KEY = 'slovor-welcome-shown'

interface LocaleOption {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

// Language order must match LanguageSwitcher in header: SK → CS → EN
const localeOptions: LocaleOption[] = [
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: FLAGS.SK },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: FLAGS.CZ },
  { code: 'en', name: 'English', nativeName: 'English', flag: FLAGS.GB },
]

export function LocaleWelcomeModal() {
  const { locale, setLocale } = useTranslation()
  const [open, setOpen] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<Locale>('en')
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale)

  const detectUserLocale = useCallback(async (): Promise<Locale> => {
    try {
      // Try to detect by IP first
      const response = await fetch('/api/detect-locale')
      if (response.ok) {
        const data = await response.json()
        if (data.locale && isValidLocale(data.locale)) {
          return data.locale
        }
      }
    } catch (error) {
      console.warn('Failed to detect locale by IP:', error)
    }

    // Fallback to browser language
    const browserLang = navigator.language.split('-')[0] as Locale
    return isValidLocale(browserLang) ? browserLang : 'en'
  }, [])

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY)
    
    if (!hasSeenWelcome) {
      // Detect locale from browser and IP
      detectUserLocale().then((detected) => {
        setDetectedLocale(detected)
        setSelectedLocale(detected)
        setOpen(true)
      })
    }
  }, [detectUserLocale])

  const isValidLocale = (locale: string): locale is Locale => {
    return ['sk', 'cs', 'en'].includes(locale)
  }

  const handleConfirm = () => {
    setLocale(selectedLocale)
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true')
    setOpen(false)
  }

  const handleSkip = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl p-8">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-3xl font-black text-gray-900 mb-2">
                Welcome to Slovor! {PARTY}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Choose your preferred language
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 my-6">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => setSelectedLocale(option.code)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                selectedLocale === option.code
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'
              }`}
            >
              {/* Left side: Large flag emoji + text */}
              <div className="flex items-center gap-4">
                {/* Large flag emoji */}
                <span className="text-4xl">
                  {option.flag}
                </span>
                {/* Language names */}
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-lg">
                    {option.nativeName}
                  </p>
                  <p className="text-sm text-gray-500">{option.name}</p>
                </div>
              </div>
              
              {/* Right side: Detected badge or checkmark */}
              <div className="flex items-center gap-2">
                {option.code === detectedLocale && selectedLocale !== option.code && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Detected
                  </span>
                )}
                {selectedLocale === option.code && (
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-6 rounded-xl"
          >
            Skip
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Continue
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          You can change the language anytime from the header
        </p>
      </DialogContent>
    </Dialog>
  )
}
