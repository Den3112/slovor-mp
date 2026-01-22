

import { createClient } from '@/lib/supabase/server'
import { getTranslationServer } from '@/lib/i18n/server'
import { listingsApi } from '@/lib/api'
import { getDashboardStats } from '@/lib/api/dashboard-stats'

import { StatsGrid } from './components/stats-grid'
import { RecentListings } from './components/recent-listings'
import { RecentMessages } from './components/recent-messages'

export default async function DashboardOverviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout handles redirect
    }

    const { t } = await getTranslationServer()

    // Fetch stats using the new API
    const stats = await getDashboardStats(user.id)

    // Fetch listings for the "Recent Listings" list
    const userListings = await listingsApi.getByUser(user.id)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {t.common.home}
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Welcome back, {user.user_metadata.full_name || user.email?.split('@')[0]}!
                    </p>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <StatsGrid
                activeListings={stats.activeListings}
                totalViews={stats.totalViews}
                favoritesCount={stats.favorites}
            />

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
                <RecentListings listings={userListings.data || []} />
                <RecentMessages
                    userId={user.id}
                    unreadCount={stats.messages}
                    conversations={stats.recentConversations || []}
                />
            </div>
        </div>
    )
}
