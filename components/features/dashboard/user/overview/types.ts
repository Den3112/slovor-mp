import { DashboardStats } from '@/lib/api/dashboard-stats'
import { Listing } from '@/lib/api'
import { User } from '@supabase/supabase-js'

export interface OverviewHeaderProps {
  user: User
}

export interface OverviewStatsProps {
  stats: DashboardStats
}

export interface PerformanceChartProps {
  data: { date: string; value: number }[]
}

export interface RecentActivityTableProps {
  listings: Listing[]
}
