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
  const { t } = useTranslation(['common', 'profile', 'dashboard'])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
            {t('dashboard:favorites')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
            {t('profile:favoritesDescription')}
          </p>
        </div>
        <div className="bg-primary/5 text-primary border-primary/10 hidden h-10 items-center justify-center rounded-lg border px-4 text-[10px] font-bold tracking-widest uppercase md:flex">
          {favoriteListings.length} {t('common:saved')}
        </div>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid gap-4 sm:gap-6">
          {favoriteListings.map((listing) => (
            <DashboardFavoriteItem key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="border-border/50 bg-background flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-xs">
          <div className="bg-primary/5 mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-1 ring-primary/10">
            <Heart className="text-primary/40 h-10 w-10" />
          </div>
          <EmptyState
            title={t('profile:noFavorites')}
            description={t('profile:noFavoritesDesc')}
          />
        </div>
      )}
    </div>
  )
}
