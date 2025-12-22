'use client'

// Listing Card Component
// Principle #1: Small component
// Principle #2: Receives data via props

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Listing } from '@/lib/supabase/queries'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

export function ListingCard({ listing, featured }: ListingCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const imageUrl = listing.images?.[0] || ''
  const hasImage = imageUrl && !imageError
  
  return (
    <Link 
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageOff className="w-16 h-16 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">No image</span>
          </div>
        )}
        
        {/* Badges */}
        {featured && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            Featured
          </div>
        )}
        
        {listing.condition === 'new' && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
            <Sparkles className="w-3 h-3" />
            New
          </div>
        )}
        
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium z-10">
            {listing.images.length} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {listing.category && (
          <div className="text-xs text-blue-600 font-semibold mb-2">
            {listing.category.name}
          </div>
        )}

        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        <div className="text-2xl font-bold text-gray-900 mb-3">
          {listing.price.toLocaleString()} {listing.currency}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          {listing.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
          )}
          
          {listing.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{listing.views}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
