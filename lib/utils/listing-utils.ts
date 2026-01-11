import type { Listing, Category } from '@/lib/types/database'

/**
 * Get localized title for listing based on locale
 */
export function getLocalizedTitle(listing: Listing, locale: string): string {
    if (locale === 'sk' && listing.title_sk) return listing.title_sk
    if (locale === 'cs' && listing.title_cs) return listing.title_cs
    if (locale === 'en' && listing.title_en) return listing.title_en
    return listing.title
}

/**
 * Get localized description for listing based on locale
 */
export function getLocalizedDescription(listing: Listing, locale: string): string {
    if (locale === 'sk' && listing.description_sk) return listing.description_sk
    if (locale === 'cs' && listing.description_cs) return listing.description_cs
    if (locale === 'en' && listing.description_en) return listing.description_en
    return listing.description
}

/**
 * Get localized category name
 */
export function getLocalizedCategoryName(category: Category, locale: string, t: Record<string, any>): string {
    if (!category) return ''
    if (locale === 'sk') return category.name_sk || category.name
    if (locale === 'cs') return category.name_cs || category.name
    if (locale === 'en') return category.name_en || category.name
    return t.categories[category.slug as keyof typeof t.categories] || category.name
}
