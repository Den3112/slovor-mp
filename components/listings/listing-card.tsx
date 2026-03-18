'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, MapPin, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sk } from 'date-fns/locale'
import { PriceDisplay } from '@/components/ui/price-display'
import { Badge } from '@/components/ui/badge'

interface ListingCardProps {
  listing: any
  isPriority?: boolean
}

export function ListingCard({ listing, isPriority = false }: ListingCardProps) {
  const primaryImage =
    listing.listings_images?.find((img: any) => img.is_primary) ||
    listing.listings_images?.[0]
  const formattedDate = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
    locale: sk,
  })

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <Link
        href={`/inzerat/${listing.id}`}
        className="relative aspect-4/3 overflow-hidden"
      >
        <Image
          src={primaryImage?.url || '/placeholders/listing.jpg'}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={isPriority}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className="bg-background/20 hover:bg-primary transform rounded-full p-2 text-white backdrop-blur-md transition-all hover:text-white active:scale-90"
            onClick={(e) => {
              e.preventDefault()
              // Handle favorite
            }}
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {listing.is_premium && (
          <Badge className="absolute top-2 left-2 border-none bg-yellow-400 text-black hover:bg-yellow-500">
            Premium
          </Badge>
        )}

        <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between">
          <PriceDisplay
            amount={listing.price}
            className="text-lg font-bold text-white drop-shadow-lg"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="space-y-1">
          <Link href={`/inzerat/${listing.id}`}>
            <h3 className="group-hover:text-primary line-clamp-2 text-base leading-snug font-bold transition-colors">
              {listing.title}
            </h3>
          </Link>
          <div className="text-muted-foreground flex items-center space-x-3 text-xs">
            <span className="flex items-center">
              <MapPin className="mr-1 h-3 w-3" />
              {listing.location_city || 'Slovensko'}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-2">
          <div className="flex items-center space-x-2">
            <div className="bg-muted h-6 w-6 overflow-hidden rounded-full">
              {listing.profiles?.avatar_url ? (
                <Image
                  src={listing.profiles.avatar_url}
                  alt={listing.profiles?.first_name || 'User'}
                  width={24}
                  height={24}
                />
              ) : (
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-[10px] font-bold">
                  {listing.profiles?.first_name?.[0] || 'U'}
                </div>
              )}
            </div>
            <span className="max-w-[100px] truncate text-xs font-medium">
              {listing.profiles?.first_name || 'Používateľ'}
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-muted-foreground/30 h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase"
          >
            {listing.condition === 'new'
              ? 'Nový'
              : listing.condition === 'like_new'
                ? 'Ako nový'
                : listing.condition === 'used'
                  ? 'Používaný'
                  : 'Repasovaný'}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-card flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div className="bg-muted aspect-4/3" />
      <div className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <div className="bg-muted h-5 w-3/4 rounded" />
          <div className="bg-muted h-3 w-1/2 rounded" />
        </div>
        <div className="bg-muted mt-auto h-4 w-2/5 rounded" />
        <div className="mt-auto flex items-center justify-between border-t pt-2">
          <div className="flex items-center space-x-2">
            <div className="bg-muted h-6 w-6 rounded-full" />
            <div className="bg-muted h-3 w-16 rounded" />
          </div>
          <div className="bg-muted h-4 w-12 rounded" />
        </div>
      </div>
    </div>
  )
}
