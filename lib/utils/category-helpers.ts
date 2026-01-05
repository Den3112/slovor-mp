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
  // Priority 1: Database localized fields
  if (locale === 'sk' && category.name_sk) return category.name_sk
  if (locale === 'cs' && category.name_cs) return category.name_cs
  if (locale === 'en' && category.name_en) return category.name_en

  // Priority 2: Translation keys (at root level of locale object)
  const slug = category.slug as string
  const translatedName = (t as Record<string, unknown>)[slug]
  if (typeof translatedName === 'string') {
    return translatedName
  }

  // Priority 3: Default category name
  return category.name
}
