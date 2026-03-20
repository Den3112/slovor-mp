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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
      {/* Premium Header */}
      <div className="border-border bg-card relative overflow-hidden rounded-2xl border p-10 shadow-md">
        <div className="bg-primary/10 absolute -top-20 -right-20 h-64 w-64 animate-pulse rounded-full opacity-40 blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="border-border bg-card flex h-16 w-16 items-center justify-center rounded-xl border shadow-lg backdrop-blur-xl">
              <Heart className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
                {t('profile:favoritesDescription')}
              </p>
              <h1 className="text-foreground text-5xl font-black tracking-tighter uppercase sm:text-6xl">
                {t('dashboard:favorites')}
              </h1>
            </div>
          </div>
          <div className="border-border bg-card relative hidden h-16 items-center justify-center rounded-xl border px-8 text-xs font-black uppercase shadow-md md:flex">
            <span className="text-primary mr-2 text-xl">
              {favoriteListings.length}
            </span>
            <span className="opacity-40">{t('common:saved')}</span>
          </div>
        </div>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid gap-6">
          {favoriteListings.map((listing) => (
            <DashboardFavoriteItem key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="glass-panel border-primary/10 bg-background/20 shadow-primary/5 relative overflow-hidden rounded-[2.5rem] p-20 text-center shadow-2xl">
          <div className="bg-primary/5 border-primary/10 relative z-10 mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border shadow-inner">
            <Heart className="text-primary/20 h-10 w-10" />
          </div>
          <div className="relative z-10">
            <EmptyState
              title={t('profile:noFavorites')}
              description={t('profile:noFavoritesDesc')}
            />
          </div>
          <div className="bg-primary/5 absolute inset-0 opacity-30 blur-3xl" />
        </div>
      )}
    </div>
  )
}
