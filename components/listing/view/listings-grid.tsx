import { motion, AnimatePresence } from 'framer-motion'
import { PackageSearch, Loader2 } from 'lucide-react'
import { ListingCard } from '../card'
import type { Listing } from '@/lib/api'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface ListingsGridProps {
    listings: Listing[]
    loading: boolean
    hasMore: boolean
    error: string | null
    t: TranslationKeys
    observerTarget: React.RefObject<HTMLDivElement | null>
    itemsPerPage: number
}

export function ListingsGrid({
    listings,
    loading,
    hasMore,
    error,
    t,
    observerTarget,
    itemsPerPage
}: ListingsGridProps) {
    return (
        <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-2 border-destructive/20 bg-destructive/5 p-12 text-center text-destructive"
                    >
                        <p className="mb-4 font-heading text-3xl font-bold italic tracking-tight">
                            Error Loading Marketplace
                        </p>
                        <p className="font-sans text-sm font-medium uppercase tracking-widest opacity-70">{error}</p>
                    </motion.div>
                ) : listings.length === 0 && !loading ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-zinc-950/50 p-8 py-32 text-center"
                    >
                        <div className="mb-8 flex h-20 w-20 items-center justify-center border-2 border-primary/20 bg-primary/5">
                            <PackageSearch className="h-10 w-10 text-primary" />
                        </div>
                        <p className="mb-4 font-heading text-4xl font-bold italic tracking-tight text-white">
                            {t.common.noResults}
                        </p>
                        <p className="max-w-sm font-sans text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            {t.common.tryDifferentFilters}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {listings.map((listing, idx) => (
                                <motion.div
                                    key={listing.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: Math.min(idx % itemsPerPage, 10) * 0.05
                                    }}
                                >
                                    <ListingCard listing={listing} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Infinite Scroll Loader & Sentinel */}
                        <div ref={observerTarget} className="flex justify-center py-12">
                            {loading && (
                                <div className="flex items-center gap-3 border-2 border-primary/20 bg-zinc-950 px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    {t.common.loading || 'Loading more...'}
                                </div>
                            )}
                        </div>

                        {/* All loaded indicator */}
                        {!hasMore && listings.length > itemsPerPage && !loading && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600"
                            >
                                {t.common.allLoaded || 'All listings loaded'}
                            </motion.p>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}
