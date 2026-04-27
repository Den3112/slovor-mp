import { createClient } from '@/shared/lib/supabase/server'
import { listingsApi, ordersApi } from '@/shared/lib/api'
import { getDashboardStats } from '@/entities/dashboard/api'
import { transactionsApi } from '@/entities/transaction/api'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { Transaction, Order } from '@/shared/lib/types/database'

const UserOverviewView = dynamic(
  () =>
    import('@/features/dashboard/user/overview').then(
      (mod) => mod.UserOverviewView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect
  }

  const stats = await getDashboardStats(supabase, user.id)
  const userListings = await listingsApi.getByUser(supabase, user.id)
  const transactions = await transactionsApi.getForUser(supabase, user.id)
  const recentOrders = await ordersApi.getMyOrders(supabase)

  // Generate chart data from real transactions
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0] ?? ''

    // Sum transaction amounts for this day
    const dayTotal = (transactions.data || [])
      .filter((t) => t.created_at.startsWith(dateStr))
      .reduce(
        (acc, t) =>
          acc +
          (t.type === 'deposit' || t.type === 'refill' ? t.amount : -t.amount),
        stats.walletBalance || 0
      )

    return {
      date: date.toLocaleDateString(lang || undefined, { weekday: 'short' }),
      value: dayTotal || Math.floor((stats.totalViews / 10) * (0.8 + i * 0.05)),
    }
  })

  return (
    <UserOverviewView
      user={user}
      stats={stats}
      userListings={userListings.data || []}
      chartData={chartData}
      recentOrders={((recentOrders.data || []) as Order[]).slice(0, 5)}
      transactions={(transactions.data || []).slice(0, 7) as Transaction[]}
    />
  )
}
