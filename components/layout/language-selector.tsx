'use client'

import {
  FlagSK,
  FlagUS,
  FlagCZ,
  SUPPORTED_LOCALES,
} from '@/components/ui/flags'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/packages/i18n/client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSelector() {
  const { i18n } = useTranslation('common')
  const locale = i18n.language
  const router = useRouter()
  const pathname = usePathname()
  const [showLangMenu, setShowLangMenu] = useState(false)

  const setLocale = (newLocale: string) => {
    if (!pathname) return
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowLangMenu(!showLangMenu)}
        onBlur={() => setTimeout(() => setShowLangMenu(false), 200)}
        aria-label="Select language"
        aria-expanded={showLangMenu}
        className="border-border/40 bg-muted/20 text-foreground hover:bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all"
      >
        <div className="bg-muted flex h-4 w-5 items-center justify-center overflow-hidden rounded-sm shadow-sm">
          <div className="h-full w-full scale-125 transform saturate-[1.2]">
            {SUPPORTED_LOCALES.find((l) => l.code === locale)?.flag}
          </div>
        </div>
        <span className="text-xs">{locale.toUpperCase()}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 opacity-40 transition-transform duration-500',
            showLangMenu && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {showLangMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="shadow-premium border-border bg-card/95 absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-lg border p-2"
          >
            {SUPPORTED_LOCALES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all',
                  locale === lang.code
                    ? 'bg-primary shadow-primary/20 text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <div className="bg-muted flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                  <div className="h-full w-full scale-125 transform saturate-[1.2]">
                    {lang.flag}
                  </div>
                </div>
                <span className="flex-1 text-left">{lang.name}</span>
                {locale === lang.code && (
                  <div className="shadow-glow h-1.5 w-1.5 rounded-sm bg-white" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MobileLanguageSelector({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const setLocale = (newLocale: string) => {
    if (!pathname) return
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <div className="mt-8">
      <p className="text-muted-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
        Language
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SUPPORTED_LOCALES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-lg border py-4 font-bold transition-all',
              locale === lang.code
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-border/50 bg-muted/30 text-muted-foreground'
            )}
          >
            <div className="flex h-6 w-9 items-center justify-center overflow-hidden rounded-sm shadow-sm">
              <div className="h-full w-full scale-125 transform saturate-[1.2]">
                {lang.flag}
              </div>
            </div>
            <span className="text-xs">{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export { FlagSK, FlagUS, FlagCZ, SUPPORTED_LOCALES }
