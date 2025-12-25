import { listingsApi } from '@/lib/supabase/queries'
import { ListingCard } from './card'

interface FeaturedListingsProps {
  limit?: number
  categoryId?: string
}

export async function FeaturedListings({ limit = 8, categoryId }: FeaturedListingsProps) {
  const result = await listingsApi.getAll({ 
    limit,
    categoryId,
    isFeatured: true,
  })

  const listings = result.data || []

  if (listings.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
