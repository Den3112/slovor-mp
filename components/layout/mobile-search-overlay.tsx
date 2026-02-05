'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants/nav-links'

import { useListingSearch } from '@/lib/hooks/use-listing-search'

interface MobileSearchOverlayProps {
    isOpen: boolean
    onClose: () => void
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
    const { t, i18n } = useTranslation('common')
    const locale = i18n.language
    const router = useRouter()

    const { query, setQuery, results, isSearching } = useListingSearch()

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (query.trim()) {
            router.push(`/${locale}/listings?q=${encodeURIComponent(query)}`)
            onClose()
        }
    }

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 bg-background"
                >
                    <div className="safe-top flex h-full flex-col">
                        {/* Header */}
                        <div className="border-border/40 flex items-center gap-3 border-b p-4">
                            <div className="bg-muted flex flex-1 items-center rounded-xl px-3 py-2">
                                <Search className="text-muted-foreground h-5 w-5" />
                                <form onSubmit={handleSearch} className="flex-1">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder={t('common.searchPlaceholder')}
                                        className="w-full bg-transparent px-3 py-1 text-base focus:outline-hidden"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </form>
                                {query && (
                                    <button onClick={() => setQuery('')}>
                                        <X className="text-muted-foreground h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-sm font-bold text-primary"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Recent Searches / Trends */}
                            {!query && (
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="mb-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            {t('common.marketTrends')}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {NAV_LINKS.categories.slice(0, 4).map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        router.push(`/${locale}${cat.href}`)
                                                        onClose()
                                                    }}
                                                    className="flex items-center gap-3 rounded-xl border border-border/40 p-3 text-left transition-active active:scale-95"
                                                >
                                                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", cat.color)}>
                                                        <cat.icon className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-sm font-bold">{t(cat.label)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="mb-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            {t('common.quickSuggestions')}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {["iPhone", "BMW", "Apartment", "Kitchen", "Table", "Jobs"].map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => {
                                                        setQuery(tag)
                                                        // Optionally trigger search immediately
                                                    }}
                                                    className="bg-muted hover:bg-muted/80 rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* Live results could go here */}
                            {query && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-sm">{t('common.searchingFor')} &quot;{query}&quot;...</span>
                                    </div>
                                    {/* Real live results */}
                                    {isSearching ? (
                                        <div className="flex items-center gap-2 py-4">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            <span className="text-sm text-muted-foreground">{t('common.loading')}</span>
                                        </div>
                                    ) : results.length > 0 ? (
                                        results.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    if (item.id) {
                                                        router.push(`/${locale}/listings/${item.id}`)
                                                        onClose()
                                                    }
                                                }}
                                                className="flex items-center justify-between border-b border-border/40 py-3 active:bg-muted/50 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.images?.[0] ? (
                                                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                                                            <Image
                                                                src={item.images[0]}
                                                                alt={item.title || 'Listing'}
                                                                fill
                                                                sizes="40px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-md">
                                                            <Search className="text-primary h-4 w-4" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold line-clamp-1">{item.title}</p>
                                                        <p className="text-xs text-primary font-medium">{item.price} {item.currency}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight className="text-muted-foreground h-4 w-4" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-4 text-sm text-muted-foreground">
                                            {t('common.noResults')}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
