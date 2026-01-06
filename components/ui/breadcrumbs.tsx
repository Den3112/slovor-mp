import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-8 inline-flex h-11 items-center gap-3 rounded-full border border-border/50 bg-card/80 px-5 text-sm shadow-sm backdrop-blur-sm">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="inline-flex items-center gap-3">
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
    </nav>
  )
}

