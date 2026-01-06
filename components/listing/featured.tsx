import { serverListingsApi } from '@/lib/api/listings-server'
import { FeaturedListingsGrid } from './FeaturedListingsGrid'

interface FeaturedListingsProps {
  limit?: number
  categoryId?: string
}

export async function FeaturedListings({
  limit = 8,
  categoryId,
}: FeaturedListingsProps) {
  // Use server-side API for Server Components
  const result = await serverListingsApi.getAll({
    limit,
    categoryId,
    isFeatured: true,
  })

  let listings = result.data || []

  // Fallback: If no featured listings, get the most recent ones
  if (listings.length === 0) {
    const fallbackRes = await serverListingsApi.getFeatured(limit)
    listings = fallbackRes.data || []
  }

  return <FeaturedListingsGrid listings={listings} />
}
