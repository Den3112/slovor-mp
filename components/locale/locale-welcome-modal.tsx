'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'
import { useTranslation, type Locale } from '@/lib/i18n'
import { FLAGS, PARTY } from '@/lib/flags'
import { cn } from '@/lib/utils'

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
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale as Locale)

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
      <DialogContent className="bg-card rounded-2xl border-0 p-8 shadow-2xl sm:max-w-md">
        <DialogHeader>
          <div className="mb-4 flex flex-col items-center gap-4">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <Globe className="text-primary h-8 w-8" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-foreground mb-2 text-3xl font-bold">
                Welcome to Slovor! {PARTY}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                Choose your preferred language
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-6 space-y-3">
          {localeOptions.map((option) => (
            <Button
              key={option.code}
              variant="outline"
              onClick={() => setSelectedLocale(option.code)}
              className={cn(
                'flex h-auto w-full items-center justify-between rounded-2xl border-2 p-5 transition-all hover:scale-[1.02]',
                selectedLocale === option.code
                  ? 'border-primary bg-primary/10 hover:bg-primary/20 shadow-md'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              )}
            >
              {/* Left side: Large flag emoji + text */}
              <div className="flex items-center gap-4">
                {/* Large flag emoji */}
                <span className="text-4xl">{option.flag}</span>
                {/* Language names */}
                <div className="text-left">
                  <p className="text-foreground text-lg font-bold">
                    {option.nativeName}
                  </p>
                  <p className="text-muted-foreground text-sm font-normal">
                    {option.name}
                  </p>
                </div>
              </div>

              {/* Right side: Detected badge or checkmark */}
              <div className="flex items-center gap-2">
                {option.code === detectedLocale &&
                  selectedLocale !== option.code && (
                    <span className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                      Detected
                    </span>
                  )}
                {selectedLocale === option.code && (
                  <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-full">
                    <Check className="text-primary-foreground h-4 w-4" />
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-border text-muted-foreground hover:border-border hover:bg-accent flex-1 rounded-lg border-2 py-6 font-semibold"
          >
            Skip
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-lg py-6 font-semibold shadow-lg transition-all hover:shadow-xl"
          >
            Continue
          </Button>
        </div>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          You can change the language anytime from the header
        </p>
      </DialogContent>
    </Dialog>
  )
}
