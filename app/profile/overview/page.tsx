import { createClient } from '@/lib/supabase/server'
import { getTranslationServer } from '@/lib/i18n/server'
import { listingsApi } from '@/lib/api'
import { getDashboardStats } from '@/lib/api/dashboard-stats'

// Components
import { StatsGrid } from './components/stats-grid'
import { RecentListings } from './components/recent-listings'
import { InboxPreview } from './components/inbox-preview'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect
  }

  const { t } = await getTranslationServer()

  // Fetch stats using the new API
  const stats = await getDashboardStats(user.id)

  // Fetch listings for the "Recent Listings" list
  const userListings = await listingsApi.getByUser(user.id)

  const activeListings = stats.activeListings
  const totalViews = stats.totalViews
  const favoritesCount = stats.favorites

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-black tracking-tight">
            {t.common.home}
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Welcome back,{' '}
            {user.user_metadata.full_name || user.email?.split('@')[0]}!
          </p>
        </div>
      </div>

      <StatsGrid
        activeListings={activeListings}
        totalViews={totalViews}
        favoritesCount={favoritesCount}
      />

      <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
        <RecentListings listings={userListings.data || []} />
        <InboxPreview stats={stats} userId={user.id} />
      </div>
    </div>
  )
}
