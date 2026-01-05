import type { Listing } from '@/lib/types/database'

export function getListingTitle(listing: Listing, locale: string): string {
    // 1. Try specific locale
    if (locale === 'sk' && listing.title_sk) return listing.title_sk
    if (locale === 'cs' && listing.title_cs) return listing.title_cs
    if (locale === 'en' && listing.title_en) return listing.title_en

    // 2. Fallback to default title
    return listing.title
}

export function getListingDescription(listing: Listing, locale: string): string {
    // 1. Try specific locale
    if (locale === 'sk' && listing.description_sk) return listing.description_sk
    if (locale === 'cs' && listing.description_cs) return listing.description_cs
    if (locale === 'en' && listing.description_en) return listing.description_en

    // 2. Fallback to default description
    return listing.description
}
