import { listingsApi } from '@/lib/api'
import { FeaturedListingsGrid } from './FeaturedListingsGrid'

interface FeaturedListingsProps {
  limit?: number
  categoryId?: string
}

export async function FeaturedListings({
  limit = 8,
  categoryId,
}: FeaturedListingsProps) {
  const result = await listingsApi.getAll({
    limit,
    categoryId,
    isFeatured: true,
  })

  let listings = result.data || []

  // Fallback: If no featured listings, get the most recent ones
  if (listings.length === 0) {
    const fallbackRes = await listingsApi.getAll({
      limit,
      categoryId,
      sort: 'newest',
    })
    listings = fallbackRes.data || []
  }

  return <FeaturedListingsGrid listings={listings} />
}
