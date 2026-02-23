import Link from 'next/link'
import type { Category } from '@/lib/api'
import { ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { CategoryIcon } from '@/components/category/category-icon'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className="group border-border bg-card hover:border-primary/40 block rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <CategoryIcon slug={category.slug} size="md" />

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-foreground group-hover:text-primary text-base font-bold transition-colors">
            {category.name}
          </h3>
          {category.listing_count !== undefined && (
            <p className="text-muted-foreground text-xs font-medium">
              {category.listing_count} listings
            </p>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight className="text-muted-foreground/40 group-hover:text-primary h-5 w-5 transition-colors" />
      </div>
    </Link>
  )
}
