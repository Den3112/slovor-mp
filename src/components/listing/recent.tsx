import { serverListingsApi } from '@/lib/api/listings-server'
import { FeaturedListingsGrid } from './featured-listings-grid'

interface RecentListingsProps {
  limit?: number
}

export async function RecentListings({ limit = 8 }: RecentListingsProps) {
  const result = await serverListingsApi.getRecent(limit)
  const listings = result.data || []

  return <FeaturedListingsGrid listings={listings} />
}
