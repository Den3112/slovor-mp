// Category Card Component
// Principle #1: Small component
// Principle #6: Use proper icons from Lucide

import Link from 'next/link'
import type { Category } from '@/lib/api'
import * as LucideIcons from 'lucide-react'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Get Lucide icon by name with proper type handling
  const getIconComponent = (
    iconName?: string | null
  ): LucideIcons.LucideIcon => {
    if (!iconName) return LucideIcons.Package

    const icon = (
      LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
    )[iconName]
    return icon || LucideIcons.Package
  }

  const IconComponent = getIconComponent(category.icon_name)

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {category.name}
          </h3>
          {category.listing_count !== undefined && (
            <p className="text-sm text-muted-foreground">
              {category.listing_count} listings
            </p>
          )}
        </div>

        {/* Arrow */}
        <LucideIcons.ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </Link>
  )
}
