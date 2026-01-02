// Utility functions for listing localization
import type { Listing } from '@/lib/types/database'
import type { Locale } from '@/lib/i18n'

/**
 * Get localized title for listing based on locale
 */
export function getLocalizedTitle(listing: Listing, locale: Locale): string {
  if (locale === 'sk' && listing.title_sk) return listing.title_sk
  if (locale === 'cs' && listing.title_cs) return listing.title_cs
  if (locale === 'en' && listing.title_en) return listing.title_en

  // Fallback to base title
  return listing.title
}

/**
 * Get localized description for listing based on locale
 */
export function getLocalizedDescription(
  listing: Listing,
  locale: Locale
): string {
  if (locale === 'sk' && listing.description_sk) return listing.description_sk
  if (locale === 'cs' && listing.description_cs) return listing.description_cs
  if (locale === 'en' && listing.description_en) return listing.description_en

  // Fallback to base description
  return listing.description
}
