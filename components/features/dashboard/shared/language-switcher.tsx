'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({
  className,
  isCollapsed,
}: {
  className?: string
  isCollapsed?: boolean
}) {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = i18n.language || 'sk'

  const switchLocale = (newLocale: string) => {
    if (!pathname) return

    // Remove the current locale from the path
    // Assumptions:
    // 1. Path starts with /[locale]/...
    // 2. Default locale might not be in path (but in this app it seems mandatory [locale])

    const segments = pathname.split('/')
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'sk')) {
      segments[1] = newLocale
    } else {
      // If no locale in path, prepend it (or handle default)
      segments.splice(1, 0, newLocale)
    }

    const newPath = segments.join('/')
    router.push(newPath)
  }

  const languages = [
    { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ]

  const currentLang =
    languages.find((l) => l.code === currentLocale) || languages[0]

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('hover:bg-muted h-9 w-9 rounded-full', className)}
          >
            <span className="text-lg leading-none">{currentLang?.flag}</span>
            <span className="sr-only">{t('language')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="right"
          className="min-w-[150px]"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className="flex items-center gap-2 font-medium"
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'text-muted-foreground hover:bg-muted/60 hover:text-foreground w-full justify-start gap-3 rounded-xl px-3 font-medium',
            className
          )}
        >
          <Globe className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{currentLang?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className="flex cursor-pointer items-center gap-3 font-medium"
          >
            <span className="text-lg leading-none">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
