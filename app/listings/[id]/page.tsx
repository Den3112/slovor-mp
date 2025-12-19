// Listing Detail Page
// Server Component with dynamic route (Principle #4)

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ErrorState } from '@/components/ui/error-state'
import { listingsApi } from '@/lib/supabase/queries'

interface ListingDetailPageProps {
  params: {
    id: string
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const result = await listingsApi.getById(params.id)

  // Handle errors (Principle #5)
  if (result.error) {
    if (result.error.message.includes('not found')) {
      notFound()
    }
    return <ErrorState error={result.error} />
  }

  const listing = result.data
  const images = listing.images || []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          {images.length > 0 ? (
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={images[0]}
                alt={listing.title}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100">
              <span className="text-6xl text-gray-300">📷</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          <p className="mt-4 text-4xl font-bold text-blue-600">
            {listing.price.toLocaleString()} {listing.currency}
          </p>

          {/* Info */}
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-base text-gray-900">📍 {listing.location}</p>
            </div>

            {listing.category && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-base text-gray-900">{listing.category.name}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {listing.user && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Seller</h3>
                <div className="mt-1 flex items-center gap-2">
                  {listing.user.avatar_url && (
                    <Image
                      src={listing.user.avatar_url}
                      alt={listing.user.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-base text-gray-900">
                    {listing.user.full_name || listing.user.username}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <button className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
