'use client'

import { motion } from 'framer-motion'
import { PackageSearch, Loader2 } from 'lucide-react'
import { ListingCard } from '../card'
import type { Listing } from '@/lib/api'

interface ListingsGridProps {
    listings: Listing[]
    loading: boolean
    error: string | null
    hasMore: boolean
    observerTarget: React.RefObject<HTMLDivElement | null>
    t: any
    itemsPerPage: number
}

export function ListingsGrid({
    listings,
    loading,
    error,
    hasMore,
    observerTarget,
    t,
    itemsPerPage,
}: ListingsGridProps) {
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-destructive/10 bg-destructive/5 text-destructive rounded-[2.5rem] border p-12 text-center"
            >
                <p className="mb-2 text-xl font-black italic">
                    Error Loading Marketplace
                </p>
                <p className="font-medium opacity-70">{error}</p>
            </motion.div>
        )
    }

    if (listings.length === 0 && !loading) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-border/60 bg-muted/20 flex flex-col items-center justify-center rounded-[3rem] border border-dashed p-8 py-32 text-center"
            >
                <div className="bg-muted/50 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <PackageSearch className="text-muted-foreground h-10 w-10" />
                </div>
                <p className="font-heading text-foreground mb-3 text-2xl font-black italic">
                    {t.common.noResults}
                </p>
                <p className="text-muted-foreground max-w-sm font-medium">
                    {t.common.tryDifferentFilters}
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
            >
                {listings.map((listing, idx) => (
                    <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: Math.min(idx % itemsPerPage, 10) * 0.05,
                        }}
                    >
                        <ListingCard listing={listing} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Infinite Scroll Loader & Sentinel */}
            <div ref={observerTarget} className="flex justify-center py-8">
                {loading && (
                    <div className="bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.common.loading || 'Loading more...'}
                    </div>
                )}
            </div>

            {/* All loaded indicator */}
            {!hasMore && listings.length > itemsPerPage && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground text-center text-sm"
                >
                    {t.common.allLoaded || 'All listings loaded'} ✓
                </motion.p>
            )}
        </div>
    )
}
