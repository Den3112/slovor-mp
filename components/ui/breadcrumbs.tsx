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
  const { t } = useTranslation()

  return (
    <nav className="mb-8 w-full overflow-x-auto pb-1 no-scrollbar">
      <div className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-border/50 bg-card/80 px-4 text-sm shadow-sm backdrop-blur-sm sm:gap-3 sm:px-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">{t.common.home}</span>
        </Link>
        {items.map((item, index) => (
          <div key={index} className="inline-flex items-center gap-2 sm:gap-3">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex items-center font-medium text-foreground">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

