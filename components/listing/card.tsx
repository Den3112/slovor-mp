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
        href={`/listings/${listing.id}`}
        className="group border-border/40 bg-card active:bg-muted/50 md:hover:border-primary/40 relative flex gap-4 overflow-hidden rounded-2xl border p-3 transition-all active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-lg"
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
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
            </>
          ) : (
            <div className="bg-muted/50 text-muted-foreground/40 flex h-full w-full items-center justify-center">
              <ImageOff className="h-6 w-6" />
            </div>
          )}

          {/* Condition Badge */}
          {listing.condition === 'new' && (
            <div className="bg-card/90 text-primary absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase backdrop-blur-sm">
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
        'group relative block overflow-hidden rounded-4xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 active:scale-[0.98]',
        listing.is_highlighted
          ? 'border-primary/20 bg-primary/5 shadow-primary/5 hover:border-primary/40 hover:shadow-primary/10'
          : 'border-border/10 bg-card/60 hover:border-primary/30 hover:shadow-soft-shadow dark:bg-white/5 dark:hover:bg-white/10'
      )}
    >
      {/* Image */}
      <div className="bg-muted relative aspect-4/3 overflow-hidden">
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
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] md:rounded-3xl" />
          </>
        ) : (
          <div className="bg-muted/50 text-muted-foreground/40 absolute inset-0 flex flex-col items-center justify-center">
            <ImageOff className="mb-2 h-8 w-8 stroke-[1.5] md:mb-3 md:h-12 md:w-12" />
            <span className="text-[9px] font-black tracking-widest uppercase md:text-[10px] md:tracking-[0.2em]">
              {t('noImage')}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 md:top-4 md:left-4 md:gap-2">
          {(featured || listing.is_highlighted) && (
            <div className="bg-primary/90 shadow-primary/30 rounded-full px-2.5 py-1 text-[9px] font-black tracking-wide text-white uppercase shadow-lg backdrop-blur-md md:px-3 md:py-1.5 md:text-[10px] md:tracking-widest">
              {t('featured')}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="bg-card/90 text-card-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black tracking-wide uppercase shadow-lg backdrop-blur-md md:gap-1.5 md:px-3 md:py-1.5 md:text-[10px] md:tracking-widest">
              <Sparkles className="fill-primary text-primary h-2.5 w-2.5 md:h-3 md:w-3" />
              {t('new')}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <FavoriteButton listingId={listing.id} />
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="glass text-foreground/80 absolute bottom-3 left-3 rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-black md:bottom-4 md:left-4 md:px-3 md:text-[10px]">
            {listing.images.length} PHOTOS
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-4 md:space-y-4 md:p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between md:mb-2">
            {listing.category && (
              <span className="text-primary text-[9px] font-black tracking-widest uppercase md:text-[10px] md:tracking-[0.2em]">
                {categoryName}
              </span>
            )}
            {listing.views_count !== undefined && (
              <div className="text-muted-foreground flex items-center gap-1 text-[9px] font-bold opacity-60 md:text-[10px]">
                <Eye className="h-3 w-3" />
                <span>{listing.views_count}</span>
              </div>
            )}
          </div>
          <h3 className="font-heading text-foreground group-hover:text-primary line-clamp-2 text-base leading-tight font-bold transition-colors duration-300 md:text-xl">
            {localizedTitle}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-1 md:pt-2">
          <PriceDisplay
            amount={listing.price}
            baseCurrency={listing.currency}
            className="font-heading text-foreground text-xl font-black tracking-tighter md:text-3xl"
          />

          {listing.location && (
            <div className="text-muted-foreground mb-0.5 flex items-center gap-1 text-[9px] font-black tracking-wide uppercase opacity-80 md:mb-1 md:text-[10px] md:tracking-widest">
              <MapPin className="text-primary h-3 w-3" />
              <span className="max-w-[80px] truncate md:max-w-[100px]">
                {listing.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
