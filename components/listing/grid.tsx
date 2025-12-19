import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/lib/supabase/queries'

interface ListingGridProps {
  listings: Listing[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No listings found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          href={`/listings/${listing.id}`}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
        >
          {listing.image_url ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <Image
                src={listing.image_url}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="p-4">
            <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
              {listing.title}
            </h3>
            <p className="text-lg font-bold text-blue-600">
              {listing.price} {listing.currency}
            </p>
            {listing.location && (
              <p className="mt-1 text-xs text-gray-500">{listing.location}</p>
            )}
            {listing.category && (
              <p className="mt-2 text-xs text-gray-400">{listing.category.name}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
