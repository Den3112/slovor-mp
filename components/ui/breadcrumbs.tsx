'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface BreadcrumbsProps {
  items?: { label: string; href?: string }[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  const { locale, t } = useTranslation()

  // if no items provided, auto-generate from pathname
  const breadcrumbs =
    items ||
    pathname
      .split('/')
      .filter((path) => path !== '')
      .map((path, index, array) => {
        // Skip the locale part (first part) for the label usually, unless you want it
        // For Slovor, first segment is usually [lang] (e.g. 'ru', 'en')
        const href = '/' + array.slice(0, index + 1).join('/')

        // Try to translate the segment if it's a known dashboard/admin page
        // We check common dashboard keys
        let label =
          path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

        // Custom translations for dashboard segments
        const translationKey = `dashboard:${path}`
        const translated = t(translationKey as any)
        if (translated && translated !== translationKey) {
          label = translated
        } else if (path === 'dashboard') {
          label = t('dashboard:welcomeHeader') || 'Dashboard'
        }

        return { label, href }
      })

  // Filter out the locale segment from display if it's the first one
  const displayItems = breadcrumbs.filter((item, index) => {
    // Skip first segment if it's the locale
    const isLocale = index === 0 && item.href === `/${item.label.toLowerCase()}`
    return !isLocale
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'text-muted-foreground/60 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase',
        className
      )}
    >
      <Link
        href={`/${locale}/`}
        className="hover:text-primary flex items-center transition-colors duration-300"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1

        return (
          <div
            key={item.href || `item-${index}`}
            className="flex items-center space-x-2"
          >
            <ChevronRight className="h-3 w-3 opacity-40" />

            {isLast || !item.href ? (
              <span
                className={cn(
                  'font-bold',
                  isLast ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
