// Category Card Component
// Principle #1: Small component
// Principle #6: Use proper icons from Lucide

import Link from 'next/link'
import type { Category } from '@/lib/api'
import * as LucideIcons from 'lucide-react'
import { useParams } from 'next/navigation'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
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
      href={`/${locale}/categories/${category.slug}`}
      className="group border-border bg-card block rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors">
          <IconComponent className="text-primary h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-foreground group-hover:text-primary text-lg font-bold transition-colors">
            {category.name}
          </h3>
          {category.listing_count !== undefined && (
            <p className="text-muted-foreground text-sm">
              {category.listing_count} listings
            </p>
          )}
        </div>

        {/* Arrow */}
        <LucideIcons.ChevronRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
      </div>
    </Link>
  )
}
