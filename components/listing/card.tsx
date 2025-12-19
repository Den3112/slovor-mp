import Link from 'next/link'
import type { Listing } from '@/lib/supabase/queries'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

export function ListingCard({ listing, featured }: ListingCardProps) {
  const isNew = new Date(listing.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white"
    >
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">📷</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ⭐ FEATURED
            </span>
          )}
          {isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              🆕 NEW
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600">
            {listing.price.toLocaleString()}
          </span>
          <span className="text-lg text-gray-600">{listing.currency}</span>
        </div>

        {listing.location && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>📍</span>
            {listing.location}
          </p>
        )}

        {listing.category && (
          <div className="mt-3 pt-3 border-t">
            <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {listing.category.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
