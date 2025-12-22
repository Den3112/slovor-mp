// Listing Card Component
// Principle #1: Minimize code (< 60 lines)
// Principle #2: No direct dependencies
// Principle #6: Code for humans

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

// Helper function - Principle #1: Small functions
function isListingNew(createdAt: string): boolean {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return new Date(createdAt).getTime() > sevenDaysAgo
}

export function ListingCard({ listing, featured }: ListingCardProps) {
  const { t, locale } = useTranslation()
  const isNew = isListingNew(listing.created_at)

  const categoryName = listing.category ? (
    locale === 'sk' ? listing.category.name_sk || listing.category.name :
      locale === 'cs' ? listing.category.name_cs || listing.category.name :
        locale === 'en' ? listing.category.name_en || listing.category.name :
          t.categories[listing.category.slug] || listing.category.name
  ) : null

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block rounded-[2rem] overflow-hidden bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {listing.images && listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <span className="text-7xl opacity-20 filter grayscale">📷</span>
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 font-black px-4 py-1.5 shadow-xl glass">
              ⭐ FEATURED
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-black px-4 py-1.5 shadow-xl glass">
              🆕 NEW
            </Badge>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-black text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-blue-600">
            {listing.price.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{listing.currency}</span>
        </div>

        <div className="flex flex-col gap-3">
          {listing.location && (
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
              <span className="text-lg">📍</span>
              {listing.location}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
            {categoryName && (
              <Badge variant="outline" className="rounded-xl font-bold uppercase tracking-wider text-[10px] py-1 border-gray-100 text-gray-400">
                {categoryName}
              </Badge>
            )}
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              {new Date(listing.created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
