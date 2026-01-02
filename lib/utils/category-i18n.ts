// Category Internationalization Utility
// Principle #1: Extract repeated logic into single function
// Principle #3: One place for category name localization

import type { Category } from '@/lib/types/database'
import type { Locale, TranslationKeys } from '@/lib/i18n/translations'

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

  // Fall back to translation key
  const translationKey = (t.categories as Record<string, string>)[category.slug]
  if (translationKey) {
    return translationKey
  }

  // Final fallback to default name
  return category.name
}
