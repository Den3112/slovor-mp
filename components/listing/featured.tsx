'use client'

import { ListingCard } from './card'
import type { Listing } from '@/lib/types/database'
import Link from 'next/link'

interface FeaturedListingsProps {
    listings: Listing[]
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
    if (!listings || listings.length === 0) {
        return null
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} featured={listing.featured} />
            ))}
        </div>
    )
}
