import type { Category } from '@/lib/types/database'

/**
 * Deduplicates categories based on their localized name.
 * Useful when multiple categories (like 'Electronics') exist across valid locales
 * but map to the same conceptual category for the user.
 */
export function getUniqueCategories(
  categories: Category[],
  locale: string,
  t: (key: string) => string
): Category[] {
  return categories.reduce((acc: Category[], current) => {
    const currentName = getCategoryName(current, locale, t).toLowerCase()

    const isDuplicate = acc.find((item) => {
      const itemName = getCategoryName(item, locale, t).toLowerCase()
      return itemName === currentName
    })

    if (!isDuplicate) {
      acc.push(current)
    }
    return acc
  }, [])
}

/**
 * Helper to get localized category name safely
 */
export function getCategoryName(
  category: Category,
  locale: string,
  t: (key: string) => string
): string {
  // Priority 1: Database localized fields
  if (locale === 'sk' && category.name_sk) return category.name_sk
  if (locale === 'cs' && category.name_cs) return category.name_cs
  if (locale === 'en' && category.name_en) return category.name_en

  // Priority 2: Translation keys (at root level of locale object)
  // Priority 2: Translation keys (using categories namespace)
  const slug = category.slug as string
  const key = `categories.${slug}`
  const translatedName = t(key)

  if (translatedName !== key) {
    return translatedName
  }

  // Priority 3: Default category name
  return category.name
}
