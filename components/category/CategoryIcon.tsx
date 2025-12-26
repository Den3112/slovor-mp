// CategoryIcon - Displays Lucide icon for category slug
// Used in: CategoryCard, CategoryPage, HomePage
// Principle #1: Small component using extracted constants
// Principle #3: Icon mappings centralized in lib/constants/category-icons.ts

import { getCategoryIcon } from '@/lib/constants/category-icons'

interface CategoryIconProps {
  slug: string
  className?: string
}

/**
 * Renders appropriate Lucide icon for given category slug
 * @param slug - Category slug (e.g., 'electronics', 'elektronika')
 * @param className - Tailwind classes for icon styling
 */
export function CategoryIcon({ slug, className = 'w-6 h-6' }: CategoryIconProps) {
  const Icon = getCategoryIcon(slug)
  return <Icon className={className} />
}
