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
  const { locale } = useTranslation()

  // if no items provided, auto-generate from pathname
  const breadcrumbs = items || pathname
    .split('/')
    .filter(path => path !== '')
    .map((path, index, array) => {
      // Skip the locale part (first part) for the label usually, unless you want it
      // For Slovor, first segment is usually [lang] (e.g. 'ru', 'en')
      const href = '/' + array.slice(0, index + 1).join('/')
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      return { label, href }
    })

  // Filter out the locale segment from display if it's the first one
  const displayItems = breadcrumbs.filter((item, index) => index > 0 || (breadcrumbs.length === 1 && item.label.length > 3))

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60", className)}>
      <Link
        href={`/${locale}/`}
        className="flex items-center hover:text-primary transition-colors duration-300"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1

        return (
          <div key={item.href || `item-${index}`} className="flex items-center space-x-2">
            <ChevronRight className="h-3 w-3 opacity-40" />

            {isLast || !item.href ? (
              <span className={cn(
                "font-bold ",
                isLast ? "text-primary" : "text-muted-foreground"
              )}>
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
