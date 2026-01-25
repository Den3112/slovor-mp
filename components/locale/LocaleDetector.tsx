'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'

const LOCALE_DISMISSED_KEY = 'slovor-locale-dismissed'
const AVAILABLE_LOCALES: Locale[] = ['sk', 'cs', 'en']

interface LocaleOption {
  code: Locale
  name: string
  flag: string
}

const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

/**
 * Detects user locale from:
 * 1. Browser language
 * 2. IP-based geolocation
 * Shows welcome modal on first visit
 */
export function LocaleDetector() {
  const { locale, setLocale } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<Locale | null>(null)
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale)

  useEffect(() => {
    // 1. Check if locale is already stored (user selected before)
    const storedLocale = localStorage.getItem('slovor-locale') as Locale
    if (storedLocale && AVAILABLE_LOCALES.includes(storedLocale)) {
      setLocale(storedLocale)
      return
    }

    // 2. Check if user dismissed without selecting (keep default)
    const dismissed = localStorage.getItem(LOCALE_DISMISSED_KEY)
    if (dismissed) return

    // 3. Detect locale for new users
    detectUserLocale()
  }, [setLocale])

  const detectUserLocale = async () => {
    let detected: Locale = 'en'

    // 1. Try browser language first
    const browserLang = (
      (navigator.language || 'en').split('-')[0] || 'en'
    ).toLowerCase()
    if (AVAILABLE_LOCALES.includes(browserLang as Locale)) {
      detected = browserLang as Locale
    }

    // 2. Try IP-based geolocation
    try {
      const response = await fetch('/api/detect-locale')
      if (response.ok) {
        const data = await response.json()
        if (data.locale && AVAILABLE_LOCALES.includes(data.locale)) {
          detected = data.locale
        }
      }
    } catch (error) {
      console.warn('Failed to detect locale from IP:', error)
    }

    setDetectedLocale(detected)
    setSelectedLocale(detected)
    setShowModal(true)
  }

  const handleConfirm = () => {
    setLocale(selectedLocale)
    localStorage.setItem('slovor-locale', selectedLocale)
    localStorage.setItem(LOCALE_DISMISSED_KEY, 'true')
    setShowModal(false)
  }

  const handleDismiss = () => {
    // Keep current locale
    localStorage.setItem(LOCALE_DISMISSED_KEY, 'true')
    setShowModal(false)
  }

  if (!showModal || !detectedLocale) return null

  const translations = {
    sk: {
      title: 'Vitajte na Slovor Marketplace! 👋',
      subtitle: 'Zistili sme váš jazyk',
      description:
        'Na základe vášho prehliadača a polohy odporúčame tento jazyk. Môžete si vybrať iný.',
      confirm: 'Pokračovať',
      selectLanguage: 'Alebo vyberte jazyk:',
    },
    cs: {
      title: 'Vítejte na Slovor Marketplace! 👋',
      subtitle: 'Zjistili jsme váš jazyk',
      description:
        'Na základě vašeho prohlížeče a polohy doporučujeme tento jazyk. Můžete si vybrat jiný.',
      confirm: 'Pokračovat',
      selectLanguage: 'Nebo vyberte jazyk:',
    },
    en: {
      title: 'Welcome to Slovor Marketplace! 👋',
      subtitle: 'We detected your language',
      description:
        'Based on your browser and location, we recommend this language. You can choose another.',
      confirm: 'Continue',
      selectLanguage: 'Or select language:',
    },
  }

  const t = translations[selectedLocale]

  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Globe className="text-primary h-6 w-6" />
            {t.title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-muted-foreground text-sm font-medium">
            {t.selectLanguage}
          </div>

          <div className="grid gap-2">
            {LOCALE_OPTIONS.map((option) => (
              <button
                key={option.code}
                onClick={() => setSelectedLocale(option.code)}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  selectedLocale === option.code
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border hover:bg-accent'
                }`}
              >
                <span className="text-3xl">{option.flag}</span>
                <span className="flex-1 text-left text-lg font-semibold">
                  {option.name}
                </span>
                {selectedLocale === option.code && (
                  <Check className="text-primary h-5 w-5" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            {selectedLocale === locale ? t.confirm : 'Skip'}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90 flex-1"
          >
            {t.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
