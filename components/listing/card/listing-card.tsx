'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Listing } from '@/lib/api'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn, getLocalizedTitle, getLocalizedCategoryName } from '@/lib/utils'
import { FavoriteButton } from '@/components/listing/shared'
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
        className="group relative flex gap-6 border-2 border-primary/10 bg-zinc-950 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-zinc-900 hover:-translate-y-1"
      >
        {/* Compact Image */}
        <div className="relative h-28 w-28 shrink-0 border-2 border-primary/10 bg-muted sm:h-32 sm:w-32">
          {hasValidImage ? (
            <>
              <Image
                src={imageUrl}
                alt={localizedTitle}
                fill
                className={cn(
                  'object-cover transition-all duration-700 group-hover:scale-110',
                  isLoading ? 'scale-105 blur-sm' : 'blur-0'
                )}
                sizes="160px"
                onError={() => {
                  setImageError(true)
                  setIsLoading(false)
                }}
                onLoad={() => setIsLoading(false)}
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/5 text-zinc-800">
              <ImageOff className="h-8 w-8 opacity-20" />
            </div>
          )}

          {/* Condition Badge */}
          {listing.condition === 'new' && (
            <div className="absolute left-0 top-0 border-r-2 border-b-2 border-primary/20 bg-primary px-2 py-1 font-sans text-[8px] font-bold uppercase tracking-widest text-white shadow-xl shadow-primary/20">
              {t.common.new}
            </div>
          )}
        </div>

        {/* Compact Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div>
            {listing.category && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                {categoryName}
              </span>
            )}
            <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold italic leading-tight text-white group-hover:text-primary transition-colors">
              {localizedTitle}
            </h3>
          </div>

          <div className="flex items-end justify-between mt-4">
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="font-sans text-xl font-black tracking-tight text-white"
            />

            {listing.location && (
              <div className="flex items-center gap-2 border-2 border-primary/10 bg-zinc-950/50 px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="max-w-[70px] truncate">{listing.location}</span>
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
      className="group relative block border-2 border-primary/10 bg-zinc-950 transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] border-b-2 border-primary/10 bg-muted overflow-hidden">
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
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="pointer-events-none absolute inset-0 border border-white/5" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/5 text-zinc-800">
            <ImageOff className="mb-2 h-8 w-8 stroke-[1.5] opacity-20 md:mb-3 md:h-12 md:w-12" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 md:text-[11px]">
              {t.common.noImage}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-0 top-0 flex flex-col items-start gap-0">
          {featured && (
            <div className="border-b-2 border-r-2 border-primary/20 bg-primary px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-transform">
              {t.common.featured}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="flex items-center gap-2 border-b-2 border-r-2 border-primary/20 bg-black px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
              <Sparkles className="h-3 w-3 fill-primary text-primary" />
              {t.common.new}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute right-3 top-3 md:right-4 md:top-4">
          <FavoriteButton listingId={listing.id} />
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-0 right-0 border-l-2 border-t-2 border-white/10 bg-black/80 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white">
            {listing.images.length} PHOTOS
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-6 bg-zinc-950">
        <div>
          <div className="mb-2 flex items-center justify-between">
            {listing.category && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                {categoryName}
              </span>
            )}
            {listing.views !== undefined && (
              <div className="flex items-center gap-1.5 font-sans text-[10px] font-bold text-zinc-500 opacity-60">
                <Eye className="h-3.5 w-3.5" />
                <span>{listing.views}</span>
              </div>
            )}
          </div>
          <h3 className="line-clamp-2 font-heading text-xl font-bold italic leading-tight text-white transition-colors duration-300 group-hover:text-primary">
            {localizedTitle}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-2">
          <PriceDisplay
            amount={listing.price}
            baseCurrency={listing.currency}
            className="font-sans text-3xl font-black tracking-tight text-white transition-transform duration-300 group-hover:scale-110"
          />

          {listing.location && (
            <div className="mb-1 flex items-center gap-2 border-2 border-primary/10 bg-zinc-950/50 px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="max-w-[100px] truncate">{listing.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
