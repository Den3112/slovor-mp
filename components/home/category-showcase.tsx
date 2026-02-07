'use client'

// CategoryShowcase - Displays featured categories grid on homepage
// Used in: HomePage
// Principle #1: Small, focused component
// Principle #2: Receives data via props

import Link from 'next/link'
import { getCategoryIcon } from '@/lib/constants/category-icons'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/api'

interface Props {
  categories: Category[]
}

export function CategoryShowcase({ categories }: Props) {
  const { locale } = useTranslation()
  const featured = categories.slice(0, 8)

  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-3xl font-bold">
            Explore Categories
          </h2>
          <p className="text-muted-foreground mt-2">
            Browse through our popular categories
          </p>
        </div>
        <Link
          href={`/${locale}/categories`}
          className="text-primary hover:text-primary/80 flex items-center gap-2 font-semibold"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {featured.map((category) => {
          const IconComponent = getCategoryIcon(category.slug)

          return (
            <Link
              key={category.id}
              href={`/${locale}/categories/${category.slug}`}
              className="group border-border bg-card rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-16 w-16 items-center justify-center rounded-lg transition-colors">
                  <IconComponent className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-foreground group-hover:text-primary font-bold transition-colors">
                  {category.name}
                </h3>
                {category.listing_count !== undefined && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {category.listing_count} ads
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
