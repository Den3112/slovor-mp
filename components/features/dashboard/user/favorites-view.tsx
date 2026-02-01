'use client'

import { DashboardFavoriteItem } from '@/components/profile/favorite-item'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'

interface FavoritesViewProps {
    favoriteListings: (Listing & { category?: { name: string } | null })[]
}

export function FavoritesView({ favoriteListings }: FavoritesViewProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Header */}
            <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-pink-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                    <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
                        {t('dashboard:favorites')}
                    </h1>
                    <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
                        {t('profile:favoritesDescription')}
                    </p>
                </div>
            </div>

            {favoriteListings.length > 0 ? (
                <div className="grid gap-4">
                    {favoriteListings.map((listing) => (
                        <DashboardFavoriteItem key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="rounded-5xl border border-white/10 bg-white/5 p-8 shadow-inner backdrop-blur-md md:p-12">
                    <EmptyState
                        icon={Heart}
                        title={t('profile:noFavorites')}
                        description={t('profile:noFavoritesDesc')}
                    />
                </div>
            )}
        </div>
    )
}
