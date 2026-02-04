'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Listing } from '@/lib/api'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedTitle } from '@/lib/utils/listing-utils'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils/cn'
import { FavoriteButton } from '@/components/listing/favorite-button'
import { PriceDisplay } from '@/components/ui/price-display'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
  variant?: 'default' | 'compact'
}

export function ListingCard({
  listing,
  featured,
  variant = 'default',
}: ListingCardProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const imageUrl = listing.images?.[0] || ''
  const hasValidImage = imageUrl && !imageError
  const localizedTitle = getLocalizedTitle(listing, locale)
  const categoryName = listing.category
    ? getLocalizedCategoryName(listing.category, locale, t)
    : ''

  // Compact variant for mobile horizontal layout
  if (variant === 'compact') {
    return (
      <Link
        href={`/${locale}/listings/${listing.id}`}
        className="group border-border/60 bg-card active:bg-muted/50 md:hover:border-primary/40 relative flex gap-4 overflow-hidden rounded-xl border p-3 transition-all active:scale-[0.98] md:hover:-translate-y-0.5 md:hover:shadow-md"
      >
        {/* Compact Image */}
        <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
          {hasValidImage ? (
            <>
              <Image
                src={imageUrl}
                alt={localizedTitle}
                fill
                className={cn(
                  'object-cover transition-all',
                  isLoading ? 'scale-105 opacity-0' : 'opacity-100'
                )}
                sizes="120px"
                onError={() => {
                  setImageError(true)
                  setIsLoading(false)
                }}
                onLoad={() => setIsLoading(false)}
                unoptimized
              />
            </>
          ) : (
            <div className="bg-muted/50 text-muted-foreground/40 flex h-full w-full items-center justify-center">
              <ImageOff className="h-6 w-6" />
            </div>
          )}

          {/* Condition Badge */}
          {listing.condition === 'new' && (
            <div className="bg-background/90 text-primary absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase shadow-sm">
              <Sparkles className="fill-primary h-2.5 w-2.5" />
              {t('new')}
            </div>
          )}
        </div>

        {/* Compact Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            {listing.category && (
              <span className="text-primary text-[9px] font-bold tracking-wider uppercase">
                {categoryName}
              </span>
            )}
            <h3 className="text-foreground mt-0.5 line-clamp-2 text-sm leading-tight font-bold sm:text-base">
              {localizedTitle}
            </h3>
          </div>

          <div className="flex items-end justify-between">
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="text-foreground text-lg font-black tracking-tight sm:text-xl"
            />

            {listing.location && (
              <div className="text-muted-foreground flex items-center gap-1 text-[9px] font-bold uppercase">
                <MapPin className="text-primary h-3 w-3" />
                <span className="max-w-[80px] truncate">
                  {listing.location}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <FavoriteButton listingId={listing.id} size="sm" />
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={`/listings/${listing.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-xl border transition-all duration-300 hover:ring-4 hover:ring-primary/5 hover:border-primary/50',
        listing.is_highlighted || featured
          ? 'border-primary/40 bg-primary/3'
          : 'border-border bg-card'
      )}
    >
      {/* Premium Border for Highlighted */}
      {(listing.is_highlighted || featured) && (
        <div className="absolute inset-x-0 -top-px h-[2px] bg-primary" />
      )}
      {/* Image Container */}
      <div className="bg-muted relative aspect-4/3 overflow-hidden">
        {hasValidImage ? (
          <>
            <Image
              src={imageUrl}
              alt={localizedTitle}
              fill
              className={cn(
                'object-cover transition-transform duration-700 group-hover:scale-105',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => {
                setImageError(true)
                setIsLoading(false)
              }}
              onLoad={() => setIsLoading(false)}
              unoptimized
              priority={featured}
            />
            {/* Darker overlay on hover */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
          </>
        ) : (
          <div className="bg-muted/50 text-muted-foreground/30 absolute inset-0 flex flex-col items-center justify-center">
            <ImageOff className="mb-2 h-10 w-10 stroke-1" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              {t('noImage')}
            </span>
          </div>
        )}

        {/* Badges - Floating Style */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {(featured || listing.is_highlighted) && (
            <div className="bg-primary flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-black tracking-widest text-white uppercase">
              <Sparkles className="h-3 w-3 fill-white" />
              {t('featured')}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="bg-background text-foreground flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-[10px] font-black tracking-widest uppercase">
              <div className="bg-emerald-500 h-1.5 w-1.5 rounded-full" />
              {t('new')}
            </div>
          )}
        </div>

        {/* Top Right: Favorite */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton listingId={listing.id} />
        </div>

        {/* Photos Count Overlay */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/80 px-2 py-1 text-[10px] font-black text-white border border-white/20">
            <span className="opacity-70">{listing.images.length}</span>
            <span className="tracking-widest uppercase text-[8px]">{t('photos') || 'Photos'}</span>
          </div>
        )}
      </div>

      {/* Content - Data Dense */}
      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            {listing.category && (
              <span className="text-primary text-[10px] font-black tracking-widest uppercase opacity-80">
                {categoryName}
              </span>
            )}
            <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold opacity-40">
              <Eye className="h-3 w-3" />
              <span>{listing.views_count || 0}</span>
            </div>
          </div>

          <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-base font-bold transition-colors duration-300">
            {localizedTitle}
          </h3>
        </div>

        {/* Dynamic Details Teaser (Attributes) */}
        {listing.attributes && Object.keys(listing.attributes).length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-60">
            {Object.entries(listing.attributes).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1 text-[10px] font-bold">
                <span className="text-muted-foreground uppercase tracking-tighter">{key}:</span>
                <span className="text-foreground">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[9px] font-black tracking-widest uppercase opacity-40 leading-none mb-1">
              {t('common:price') || 'Price'}
            </span>
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="font-heading text-foreground text-xl font-black tracking-tighter"
            />
          </div>

          {listing.location && (
            <div className="bg-muted/30 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground">
              <MapPin className="text-primary h-3 w-3" />
              <span className="max-w-[80px] truncate text-[10px] font-bold uppercase tracking-wide">
                {listing.location.split(',')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
