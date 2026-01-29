'use client'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t, locale } = useTranslation()
  const homeHref = `/${locale}`

  return (
    <nav className="no-scrollbar mb-8 w-full overflow-x-auto pb-1">
      <div className="border-border/50 bg-card/80 inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap shadow-sm backdrop-blur-sm sm:gap-3 sm:px-5">
        <Link
          href={homeHref}
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">{t('common.home')}</span>
        </Link>
        {items.map((item, index) => (
          <div key={index} className="inline-flex items-center gap-2 sm:gap-3">
            <ChevronRight className="text-muted-foreground/50 h-4 w-4" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-primary inline-flex items-center transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground inline-flex items-center font-medium">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
