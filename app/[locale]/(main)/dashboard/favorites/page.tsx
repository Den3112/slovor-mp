import { FavoritesView } from '@/components/features/dashboard/user/favorites'
import { createClient } from '@/lib/supabase/server'

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
    (favorites?.map((f) => f.listing).filter(Boolean) as any[]) || []

  return <FavoritesView favoriteListings={favoriteListings} />
}
