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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          {t('dashboard:favorites')}
        </h1>
        <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
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
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-lg border p-12 text-center shadow-sm">
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
