import { DashboardStats } from '@/entities/dashboard/api'
import { Listing } from '@/shared/lib/api'
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
