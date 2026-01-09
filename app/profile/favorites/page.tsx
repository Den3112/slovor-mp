import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'
import { DashboardFavoriteItem } from '@/components/profile/favorite-item'

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
      {/* Premium Header - Reusing style pattern */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-[2rem] bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2">Favorites</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg max-w-lg leading-relaxed">Collection of items you&apos;re keeping an eye on.</p>
        </div>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid gap-4">
          {favoriteListings.map((listing) => (
            <DashboardFavoriteItem key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12 shadow-inner">
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="You haven&apos;t saved any listings yet. Browse the marketplace and click the heart icon to save items you love."
          />
        </div>
      )}
    </div>
  )
}
