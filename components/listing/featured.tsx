import { listingsApi } from '@/lib/api'
import { ListingCard } from './card'

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

  if (listings.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border/50 bg-muted/20 py-20 text-center">
        <p className="font-medium text-muted-foreground">
          No listings available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
