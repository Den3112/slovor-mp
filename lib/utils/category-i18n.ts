// Category Internationalization Utility
// Principle #1: Extract repeated logic into single function
// Principle #3: One place for category name localization

import type { Category } from '@/lib/types/database'
import type { Locale, TranslationKeys } from '@/lib/i18n/translations'

/**
 * Deduplicates categories based on their localized name.
 */
export function getUniqueCategories(
  categories: Category[],
  locale: Locale,
  t: TranslationKeys
): Category[] {
  return categories.reduce((acc: Category[], current) => {
    const currentName = getLocalizedCategoryName(current, locale, t).toLowerCase()

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
  locale: Locale,
  t: TranslationKeys
): string {
  // Try locale-specific name from database first
  if (locale === 'sk' && category.name_sk) return category.name_sk
  if (locale === 'cs' && category.name_cs) return category.name_cs
  if (locale === 'en' && category.name_en) return category.name_en

  // Fallback to translation keys
  const categories = t.categories
  if (categories && typeof categories === 'object') {
    const translation = (categories as Record<string, string>)[category.slug]
    if (typeof translation === 'string') return translation
  }

  // Final fallback to default name
  return category.name || (category.slug ? category.slug.charAt(0).toUpperCase() + category.slug.slice(1) : 'Category')
}
