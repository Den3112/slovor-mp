// Category Internationalization Utility
// Principle #1: Extract repeated logic into single function
// Principle #3: One place for category name localization

import type { Category } from '@/shared/lib/types/database'

/**
 * Returns localized category name based on current locale
 * Falls back to: locale-specific name → translation key → default name
 *
 * @param category - Category object from database
 * @param locale - Current user locale (sk, cs, en)
 * @param t - Translation object
 * @returns Localized category name
 *
 * @example
 * const name = getLocalizedCategoryName(category, 'sk', t)
 * // Returns: "Elektronika" (from category.name_sk)
 */
export function getLocalizedCategoryName(
  category: Category,
  locale: string,
  t: (key: string, options?: any) => string
): string {
  // Try locale-specific name first
  if (locale === 'sk' && category.name_sk) {
    return category.name_sk
  }
  if (locale === 'cs' && category.name_cs) {
    return category.name_cs
  }
  if (locale === 'en' && category.name_en) {
    return category.name_en
  }

  // Fall back to translation key (under 'categories' namespace)
  const translationKey = t(`categories:${category.slug}`, { defaultValue: '' })
  if (translationKey) {
    return translationKey
  }

  // Final fallback to default name or capitalized slug
  if (category.name) return category.name

  return category.slug.charAt(0).toUpperCase() + category.slug.slice(1)
}

// Alias for backward compatibility
export { getLocalizedCategoryName as getCategoryName }

/**
 * Deduplicates categories based on their localized name.
 * Useful when multiple categories (like 'Electronics') exist across valid locales
 * but map to the same conceptual category for the user.
 */
export function getUniqueCategories(
  categories: Category[],
  locale: string,
  t: (key: string, options?: any) => string
): Category[] {
  return categories.reduce((acc: Category[], current) => {
    const currentName = getLocalizedCategoryName(
      current,
      locale,
      t
    ).toLowerCase()

    const isDuplicate = acc.find((item) => {
      const itemName = getLocalizedCategoryName(item, locale, t).toLowerCase()
      return itemName === currentName
    })

    if (!isDuplicate) {
      acc.push(current)
    }
    return acc
  }, [])
}
