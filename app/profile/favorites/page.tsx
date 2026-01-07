import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'
import { DashboardFavoriteItem } from '@/components/dashboard/favorite-item'

export default async function DashboardFavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch favorites with listing details
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      listing_id,
      listing:listings (
        *,
        category:categories(*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favoriteListings = favorites?.map(f => f.listing).filter(Boolean) as any[] || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-black">Favorites</h1>
        <p className="text-muted-foreground">Items you&apos;ve saved for later</p>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid gap-4">
          {favoriteListings.map((listing) => (
            <DashboardFavoriteItem key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/40 bg-card p-12">
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Heart items you like to save them here."
          />
        </div>
      )}
    </div>
  )
}
