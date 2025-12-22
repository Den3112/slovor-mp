import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ErrorState } from '@/components/ui/error-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { listingsApi } from '@/lib/supabase/queries'

interface ListingDetailPageProps {
  params: {
    id: string
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params
  const result = await listingsApi.getById(id)

  if (result.error) {
    if (result.error.includes('not found')) {
      notFound()
    }
    return <ErrorState message={result.error} />
  }

  const listing = result.data

  if (!listing) {
    notFound()
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Listings', href: '/listings' },
            ...(listing.category ? [{ label: listing.category.name, href: `/categories/${listing.category.slug}` }] : []),
            { label: listing.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              {listing.images && listing.images[0] ? (
                <div className="aspect-[16/9] relative">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] flex items-center justify-center bg-gray-100">
                  <span className="text-9xl">📷</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{listing.title}</h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-bold text-blue-600">
                  {listing.price.toLocaleString()}
                </span>
                <span className="text-2xl text-gray-600">{listing.currency}</span>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-xl font-bold mb-4">Contact Seller</h3>

              <button className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-3 text-lg">
                📞 Call Now
              </button>

              <button className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors mb-3 text-lg">
                💬 Chat
              </button>

              <button className="w-full border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-lg">
                ✉️ Email
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-xl font-bold mb-4">Details</h3>

              {listing.location && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{listing.location}</p>
                  </div>
                </div>
              )}

              {listing.category && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <Link
                      href={`/categories/${listing.category.slug}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {listing.category.name}
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-medium">
                    {new Date(listing.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
