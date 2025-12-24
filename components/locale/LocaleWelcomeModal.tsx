'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'
import { useTranslation, type Locale } from '@/lib/i18n'

const WELCOME_SHOWN_KEY = 'slovor-welcome-shown'

interface LocaleOption {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

const localeOptions: LocaleOption[] = [
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
]

export function LocaleWelcomeModal() {
  const { locale, setLocale } = useTranslation()
  const [open, setOpen] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<Locale>('en')
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale)

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
  }, [])

  const detectUserLocale = async (): Promise<Locale> => {
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
  }

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black">
                Welcome to Slovor! 🎉
              </DialogTitle>
              <DialogDescription className="text-sm">
                Choose your preferred language
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => setSelectedLocale(option.code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedLocale === option.code
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{option.flag}</span>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{option.nativeName}</p>
                  <p className="text-sm text-gray-500">{option.name}</p>
                </div>
              </div>
              {selectedLocale === option.code && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              {option.code === detectedLocale && selectedLocale !== option.code && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Detected
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          You can change the language anytime from the header
        </p>
      </DialogContent>
    </Dialog>
  )
}
