'use client'

import { DashboardFavoriteItem } from '@/components/seller-profile/favorite-item'
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
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
                    {t('dashboard:favorites')}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {t('profile:favoritesDescription')}
                </p>
            </div>

            {favoriteListings.length > 0 ? (
                <div className="grid gap-4">
                    {favoriteListings.map((listing) => (
                        <DashboardFavoriteItem key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card p-12 shadow-sm text-center flex flex-col items-center justify-center">
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
