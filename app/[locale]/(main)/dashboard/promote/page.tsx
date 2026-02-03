'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/components/providers/auth-provider'
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

export default function PromotionDashboardPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { currency } = useCurrency()
    const router = useRouter()
    const [listings, setListings] = useState<Listing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        async function fetchListings() {
            if (!user) return
            const { data } = await listingsApi.getByUser(user.id)
            if (data) {
                // Only show active listings for promotion
                setListings(data.filter((l: Listing) => l.status === 'active'))
            }
            setIsLoading(false)
        }
        fetchListings()
    }, [user])

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
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
                    {t('dashboard:promote.title')}
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    {t('dashboard:promote.subtitle')}
                </p>
            </div>

            {/* Search and Filter */}
            <div className="relative group max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                    type="text"
                    placeholder={t('dashboard:searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-card w-full rounded-xl border border-border px-12 py-4 font-bold outline-none ring-primary/20 transition-all focus:ring-4"
                />
            </div>

            {/* Listings Grid */}
            <div className="space-y-6">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('dashboard:promote.selectListing')} ({filteredListings.length})
                </h2>

                {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredListings.map((listing) => (
                                <motion.div
                                    key={listing.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => router.push(`/listings/${listing.id}/promote`)}
                                    className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                                >
                                    <div className="flex flex-col h-full">
                                        {/* Image Placeholder/Thumbnail */}
                                        <div className="relative aspect-video w-full overflow-hidden bg-muted font-sans">
                                            {listing.images?.[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground/20" />
                                                </div>
                                            )}
                                            {listing.is_highlighted && (
                                                <div className="absolute top-3 left-3 rounded-lg bg-amber-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-sm">
                                                    Promoted
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 p-5 space-y-4">
                                            <div className="space-y-1">
                                                <h3 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                    {listing.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(listing.created_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-lg font-black text-foreground">
                                                    {formatPrice(listing.price, currency || listing.currency)}
                                                </span>
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                                    <ArrowRight className="h-4 w-4" />
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
                        actionHref="/create-ad"
                    />
                )}
            </div>
        </div>
    )
}
