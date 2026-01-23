import { DashboardFavoriteItem } from '@/components/profile/favorite-item'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'

export default async function DashboardFavoritesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch favorites with listing details
  const { data: favorites } = await supabase
    .from('favorites')
    .select(
      `
      listing_id,
      listing:listings (
        *,
        category:categories(*)
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const favoriteListings =
    (favorites?.map((f) => f.listing).filter(Boolean) as any[]) || [] // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <div className="space-y-6">
      {/* Premium Header - Reusing style pattern */}
      <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-pink-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
            Favorites
          </h1>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
            Collection of items you&apos;re keeping an eye on.
          </p>
        </div>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid gap-4">
          {favoriteListings.map((listing) => (
            <DashboardFavoriteItem key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-inner backdrop-blur-md md:p-12">
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="You haven't saved any listings yet. Browse the marketplace and click the heart icon to save items you love."
          />
        </div>
      )}
    </div>
  )
}
