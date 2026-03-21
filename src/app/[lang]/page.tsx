import { HomeView } from '@/components/home/home-view'
import { listingsApi, categoriesApi } from '@/lib/api'
import { ListingCard } from '@/components/features/listing/ui/card'

export const revalidate = 3600 // Revalidate home page every hour

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Fetch data for the home page sections
  const [featuredResult, recentResult, categoriesResult] = await Promise.all([
    listingsApi.getAll({ limit: 4, isFeatured: true }),
    listingsApi.getAll({ limit: 8 }),
    categoriesApi.getAll(),
  ])

  const featuredListings = featuredResult.data || []
  const recentListings = recentResult.data || []
  const categories = categoriesResult.data || []

  return (
    <HomeView
      categories={categories}
      categoriesError={
        categoriesResult.error ? String(categoriesResult.error) : null
      }
      lang={lang}
      recentListings={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </HomeView>
  )
}
