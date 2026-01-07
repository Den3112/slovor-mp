'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Listing } from '@/lib/api'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedTitle } from '@/lib/utils/listing-i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils'
import { FavoriteButton } from '@/components/listing/favorite-button'
import { PriceDisplay } from '@/components/ui/price-display'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
  variant?: 'default' | 'compact'
}

export function ListingCard({ listing, featured, variant = 'default' }: ListingCardProps) {
  const { locale, t } = useTranslation()
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
        href={`/listings/${listing.id}`}
        className="group relative flex gap-4 overflow-hidden rounded-2xl border border-border/40 bg-card p-3 transition-all active:scale-[0.98] active:bg-muted/50 md:hover:-translate-y-1 md:hover:border-primary/40 md:hover:shadow-lg"
      >
        {/* Compact Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
          {hasValidImage ? (
            <>
              <Image
                src={imageUrl}
                alt={localizedTitle}
                fill
                className={cn(
                  'object-cover transition-all',
                  isLoading ? 'scale-105 blur-sm' : 'blur-0'
                )}
                sizes="120px"
                onError={() => {
                  setImageError(true)
                  setIsLoading(false)
                }}
                onLoad={() => setIsLoading(false)}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/50 text-muted-foreground/40">
              <ImageOff className="h-6 w-6" />
            </div>
          )}

          {/* Condition Badge */}
          {listing.condition === 'new' && (
            <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-card/90 px-1.5 py-0.5 text-[8px] font-black uppercase text-primary backdrop-blur-sm">
              <Sparkles className="h-2.5 w-2.5 fill-primary" />
              {t.common.new}
            </div>
          )}
        </div>

        {/* Compact Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            {listing.category && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                {categoryName}
              </span>
            )}
            <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-tight text-foreground sm:text-base">
              {localizedTitle}
            </h3>
          </div>

          <div className="flex items-end justify-between">
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="text-lg font-black tracking-tight text-foreground sm:text-xl"
            />

            {listing.location && (
              <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="max-w-[80px] truncate">{listing.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute right-2 top-2">
          <FavoriteButton listingId={listing.id} size="sm" />
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm transition-all duration-500 active:scale-[0.98] md:rounded-3xl hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.2)] dark:bg-muted/10 dark:hover:bg-muted/20"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasValidImage ? (
          <>
            <Image
              src={imageUrl}
              alt={localizedTitle}
              fill
              className={cn(
                'object-cover transition-transform duration-700 group-hover:scale-110',
                isLoading ? 'scale-105 blur-md' : 'blur-0'
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] md:rounded-3xl" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground/40">
            <ImageOff className="mb-2 h-8 w-8 stroke-[1.5] md:mb-3 md:h-12 md:w-12" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] md:text-[10px] md:tracking-[0.2em]">
              {t.common.noImage}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 md:left-4 md:top-4 md:gap-2">
          {featured && (
            <div className="rounded-full bg-primary/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-lg shadow-primary/30 backdrop-blur-md md:px-3 md:py-1.5 md:text-[10px] md:tracking-widest">
              {t.common.featured}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-card-foreground shadow-lg backdrop-blur-md md:gap-1.5 md:px-3 md:py-1.5 md:text-[10px] md:tracking-widest">
              <Sparkles className="h-2.5 w-2.5 fill-primary text-primary md:h-3 md:w-3" />
              {t.common.new}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute right-3 top-3 md:right-4 md:top-4">
          <FavoriteButton listingId={listing.id} />
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="glass absolute bottom-3 left-3 rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-black text-foreground/80 md:bottom-4 md:left-4 md:px-3 md:text-[10px]">
            {listing.images.length} PHOTOS
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-4 md:space-y-4 md:p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between md:mb-2">
            {listing.category && (
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary md:text-[10px] md:tracking-[0.2em]">
                {categoryName}
              </span>
            )}
            {listing.views !== undefined && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground opacity-60 md:text-[10px]">
                <Eye className="h-3 w-3" />
                <span>{listing.views}</span>
              </div>
            )}
          </div>
          <h3 className="line-clamp-2 font-heading text-base font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary md:text-xl">
            {localizedTitle}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-1 md:pt-2">
          <PriceDisplay
            amount={listing.price}
            baseCurrency={listing.currency}
            className="font-heading text-xl font-black tracking-tighter text-foreground md:text-3xl"
          />

          {listing.location && (
            <div className="mb-0.5 flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-muted-foreground opacity-80 md:mb-1 md:text-[10px] md:tracking-widest">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="max-w-[80px] truncate md:max-w-[100px]">{listing.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
