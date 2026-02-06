import { PackageSearch, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingCard } from '../card';
import { ActiveFilters } from '../active-filters';
import { useTranslation } from '@/lib/i18n';
import { ListingsGridProps } from './types';

const ITEMS_PER_PAGE = 12;

export function ListingsGrid({ listings, error, loading, hasMore, observerTarget }: ListingsGridProps) {
    const { t } = useTranslation();

    return (
        <main className="lg:col-span-9">
            <ActiveFilters />
            <AnimatePresence mode="wait">
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-destructive/10 bg-destructive/5 text-destructive rounded-xl border p-12 text-center"
                    >
                        <p className="mb-2 text-xl font-bold">
                            {t('common:errorLoadingMarketplace') || 'Error Loading Marketplace'}
                        </p>
                        <p className="font-medium opacity-70">{error}</p>
                    </motion.div>
                ) : listings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-border/60 bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 py-32 text-center"
                    >
                        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-xl border border-border/50">
                            <PackageSearch className="text-muted-foreground/40 h-10 w-10" />
                        </div>
                        <p className="font-heading text-foreground mb-3 text-2xl font-bold">
                            {t('common:noResults')}
                        </p>
                        <p className="text-muted-foreground max-w-sm font-medium">
                            {t('common:tryDifferentFilters')}
                        </p>
                    </motion.div>
                ) : (
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
                                        delay: Math.min(idx % ITEMS_PER_PAGE, 10) * 0.05,
                                    }}
                                >
                                    <ListingCard listing={listing} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Infinite Scroll Loader & Sentinel */}
                        <div
                            ref={observerTarget}
                            className="flex justify-center py-8"
                        >
                            {loading && (
                                <div className="bg-card text-muted-foreground flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-sm">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    {t('common:loading') || 'Loading more...'}
                                </div>
                            )}
                        </div>

                        {/* All loaded indicator */}
                        {!hasMore && listings.length > ITEMS_PER_PAGE && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-muted-foreground text-center text-sm"
                            >
                                {t('common:allLoaded') || 'All listings loaded'} ✓
                            </motion.p>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
