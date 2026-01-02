import type { Category } from '@/lib/types/database'
import type { TranslationKeys } from '@/lib/i18n'

/**
 * Deduplicates categories based on their localized name.
 * Useful when multiple categories (like 'Electronics') exist across valid locales
 * but map to the same conceptual category for the user.
 */
export function getUniqueCategories(
  categories: Category[],
  locale: string,
  t: TranslationKeys
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
  t: TranslationKeys
): string {
  if (locale === 'sk') return category.name_sk || category.name
  if (locale === 'cs') return category.name_cs || category.name
  if (locale === 'en') return category.name_en || category.name
  return (
    t.categories[category.slug as keyof typeof t.categories] || category.name
  )
}
