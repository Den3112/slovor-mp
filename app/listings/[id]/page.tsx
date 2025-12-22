import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ErrorState } from '@/components/ui/error-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { listingsApi } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import { Phone, MessageSquare, Mail, MapPin, Calendar, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    <div className="bg-gray-50/50 min-h-screen pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: 'Listings', href: '/listings' },
            ...(listing.category ? [{ label: listing.category.name, href: `/categories/${listing.category.slug}` }] : []),
            { label: listing.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Section */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/5 group border border-gray-100">
              {listing.images && listing.images[0] ? (
                <div className="aspect-[16/10] relative">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              ) : (
                <div className="aspect-[16/10] flex items-center justify-center bg-gray-50">
                  <span className="text-9xl opacity-10 grayscale">📷</span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-blue-900/5 border border-gray-50">
              <div className="flex flex-col gap-4 mb-10">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-blue-600">
                      {listing.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-bold text-gray-400 uppercase tracking-widest">{listing.currency}</span>
                  </div>
                  <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  Description
                </h3>
                <p className="text-lg text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-600/10 border-4 border-blue-50 sticky top-32 overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute -right-20 -top-20 w-44 h-44 bg-blue-600/5 rounded-full blur-3xl"></div>

              <h3 className="text-2xl font-black text-gray-900 mb-8 relative">Contact Seller</h3>

              <div className="space-y-4 relative">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 font-black text-lg shadow-lg hover:shadow-blue-200 transition-all flex gap-3">
                  <Phone className="w-6 h-6" /> Call Now
                </Button>

                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-8 font-black text-lg shadow-lg hover:shadow-green-100 transition-all flex gap-3">
                  <MessageSquare className="w-6 h-6" /> Live Chat
                </Button>

                <Button variant="outline" className="w-full border-2 border-gray-100 text-gray-500 hover:text-gray-900 rounded-2xl py-8 font-black text-lg transition-all flex gap-3">
                  <Mail className="w-6 h-6" /> Send Message
                </Button>
              </div>

              <p className="text-center text-[10px] uppercase font-black tracking-widest text-gray-300 mt-8">
                Typical response time: &lt; 2 hours
              </p>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5 border border-gray-50 space-y-8">
              <h3 className="text-xl font-black text-gray-900 mb-2">Item Details</h3>

              <div className="space-y-6">
                {listing.location && (
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</p>
                      <p className="font-bold text-gray-900">{listing.location}</p>
                    </div>
                  </div>
                )}

                {listing.category && (
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <Tag className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</p>
                      <Link
                        href={`/categories/${listing.category.slug}`}
                        className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2"
                      >
                        {listing.category.name}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Posted On</p>
                    <p className="font-bold text-gray-900">
                      {new Date(listing.created_at).toLocaleDateString(undefined, {
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
    </div>
  )
}
