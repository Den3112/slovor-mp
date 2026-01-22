'use client'

import { ListingCard } from './listing-card'
import { motion } from 'framer-motion'
import type { Listing } from '@/lib/api'

interface ListingGridProps {
    listings: Listing[]
    featured?: boolean
}

export function ListingGrid({ listings, featured }: ListingGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing, idx) => (
                <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: Math.min(idx % 12, 10) * 0.05
                    }}
                >
                    <ListingCard listing={listing} featured={featured} />
                </motion.div>
            ))}
        </div>
    )
}
