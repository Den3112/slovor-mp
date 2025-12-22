// Listing Detail Page - Server Component
// Principle #4: Explicit data fetching

import { notFound } from 'next/navigation'
import { listingsApi } from '@/lib/supabase/queries'
import { ImageGallery } from '@/components/listing/image-gallery'
import { ErrorState } from '@/components/ui/error-state'
import { MapPin, Eye, Calendar, Sparkles, PackageCheck } from 'lucide-react'

interface Props {
  params: {
    id: string
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const result = await listingsApi.getById(params.id)

  if (result.error) {
    return <ErrorState message={result.error} />
  }

  if (!result.data) {
    notFound()
  }

  const listing = result.data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <ImageGallery 
                images={listing.images || []} 
                title={listing.title} 
              />
            </div>

            {/* Listing Info */}
            <div className="space-y-6">
              {/* Category */}
              {listing.category && (
                <div className="text-sm text-blue-600 font-semibold">
                  {listing.category.name}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900">
                {listing.title}
              </h1>

              {/* Price */}
              <div className="text-4xl font-bold text-blue-600">
                {listing.price.toLocaleString()} {listing.currency}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {listing.condition && (
                  <div className="flex items-center gap-2">
                    {listing.condition === 'new' ? (
                      <Sparkles className="w-4 h-4 text-green-500" />
                    ) : (
                      <PackageCheck className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="capitalize">{listing.condition}</span>
                  </div>
                )}
                {listing.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                )}
                {listing.views !== undefined && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views} views</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Contact Button */}
              <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
