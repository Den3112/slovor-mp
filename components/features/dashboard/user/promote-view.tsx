'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { listingsApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'
import {
    Rocket,
    Search,
    ArrowRight,
    Loader2,
    Calendar,
    Image as ImageIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '@/components/ui/empty-state'
import { formatPrice } from '@/lib/utils/formatting'
import { useCurrency } from '@/components/providers/currency-provider'
import { Badge } from '@/components/ui/badge'

interface PromoteViewProps {
    userId: string
}

export function PromoteView({ userId }: PromoteViewProps) {
    const { t, locale } = useTranslation()
    const { currency } = useCurrency()
    const router = useRouter()
    const [listings, setListings] = useState<Listing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        async function fetchListings() {
            if (!userId) return
            const { data } = await listingsApi.getByUser(userId)
            if (data) {
                // Only show active listings for promotion
                setListings(data.filter((l: Listing) => l.status === 'active'))
            }
            setIsLoading(false)
        }
        fetchListings()
    }, [userId])

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase  flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-primary" />
                    {t('dashboard:promote.title')}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {t('dashboard:promote.subtitle')}
                </p>
            </div>

            {/* Search and Filter */}
            <div className="relative group max-w-xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                <input
                    type="text"
                    placeholder={t('dashboard:searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-card w-full rounded-xl border border-border/60 px-12 py-3.5 text-sm font-bold outline-none ring-primary/10 transition-all focus:ring-4 focus:border-primary/40 shadow-sm"
                />
            </div>

            {/* Listings Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        {t('dashboard:promote.selectListing')}
                        <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[9px] font-bold tracking-widest bg-muted/50">
                            {filteredListings.length}
                        </Badge>
                    </h2>
                </div>

                {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredListings.map((listing) => (
                                <motion.div
                                    key={listing.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => router.push(`/${locale}/listings/${listing.id}/promote`)}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/10">
                                            {listing.images?.[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground/10" />
                                                </div>
                                            )}
                                            {listing.is_highlighted && (
                                                <div className="absolute top-4 left-4 z-10 rounded-lg bg-amber-500 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-amber-500/20">
                                                    Promoted
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <div className="flex flex-col flex-1 p-6 space-y-4">
                                            <div className="space-y-1.5">
                                                <h3 className="line-clamp-1 text-base font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
                                                    {listing.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest ">
                                                    <Calendar className="h-3.5 w-3.5 mt-[-2px]" />
                                                    {new Date(listing.created_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-[-2px]">Price</span>
                                                    <span className="text-xl font-bold tracking-tighter text-foreground">
                                                        {formatPrice(listing.price, currency || listing.currency)}
                                                    </span>
                                                </div>
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <EmptyState
                        icon={Rocket}
                        title={t('dashboard:noListings')}
                        description={t('dashboard:noActiveListingsDescription')}
                        actionLabel={t('dashboard:newListing')}
                        actionHref={`/${locale}/post`}
                    />
                )}
            </div>
        </div>
    )
}
