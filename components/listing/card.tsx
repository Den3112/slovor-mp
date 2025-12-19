// Listing Card Component
// Small, single responsibility (Principle #1, #3)

import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/types/database'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const firstImage = listing.images?.[0]
  const hasImage = !!firstImage

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={firstImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-gray-300">📷</span>
          </div>
        )}
        {listing.featured && (
          <div className="absolute top-2 right-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-gray-900">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold text-gray-900 group-hover:text-blue-600">
          {listing.title}
        </h3>
        <p className="mb-2 text-2xl font-bold text-blue-600">
          {listing.price.toLocaleString()} {listing.currency}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            📍 {listing.location}
          </span>
          {listing.category && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
              {listing.category.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
