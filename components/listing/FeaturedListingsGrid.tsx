'use client'

import { ListingCard } from './card'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/api'

interface FeaturedListingsGridProps {
    listings: Listing[]
}

export function FeaturedListingsGrid({ listings }: FeaturedListingsGridProps) {
    const { t } = useTranslation()

    if (listings.length === 0) {
        return (
            <div className="rounded-[2rem] border border-dashed border-border/50 bg-muted/20 py-20 text-center">
                <p className="font-medium text-muted-foreground">
                    {t.common.noListingsAvailable || 'No listings available'}
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} featured={index < 4} />
            ))}
        </div>
    )
}
