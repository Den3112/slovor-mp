import { createClient } from '@/lib/supabase/server'
import { getTranslationServer } from '@/lib/i18n/server'
import { listingsApi } from '@/lib/api'
import { getDashboardStats } from '@/lib/api/dashboard-stats'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const UserOverviewView = dynamic(() => import('@/components/features/dashboard/user/overview-view').then(mod => mod.UserOverviewView), {
  loading: () => (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
})

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect
  }

  const { locale } = await getTranslationServer()
  const stats = await getDashboardStats(user.id)
  const userListings = await listingsApi.getByUser(user.id, supabase)

  // Generate mock chart data
  // (Ideally this should be in an API or passed from real data)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString(locale, { weekday: 'short' }),
      value: Math.floor((stats.totalViews / 10) * (0.8 + Math.random() * 0.4)),
    }
  })

  return (
    <UserOverviewView
      user={user}
      stats={stats}
      userListings={userListings.data || []}
      chartData={chartData}
    />
  )
}
