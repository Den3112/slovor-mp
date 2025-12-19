import Link from 'next/link'
import type { Listing } from '@/lib/supabase/queries'

interface ListingGridProps {
  listings: Listing[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No listings found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          href={`/listings/${listing.id}`}
          className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">📷</span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
            <p className="text-blue-600 font-bold">
              {listing.price.toLocaleString()} {listing.currency}
            </p>
            {listing.location && (
              <p className="text-sm text-gray-500 mt-1">📍 {listing.location}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
