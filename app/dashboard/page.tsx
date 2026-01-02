'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { motion } from 'framer-motion'
import { Eye, List, Heart, TrendingUp, Loader2 } from 'lucide-react'
import { dashboardApi } from '@/lib/api/dashboard'
import type { DashboardStats } from '@/lib/api/dashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadStats = async () => {
      setIsLoading(true)
      const res = await dashboardApi.getStats(user.id)
      if (res.error) {
        setError(res.error)
      } else {
        setStats(res.data)
      }
      setIsLoading(false)
    }

    loadStats()
  }, [user])

  const statsData = [
    {
      label: 'Total Views',
      value: stats?.totalViews.toLocaleString() || '0',
      icon: Eye,
      change: stats?.avgViewsPerListing
        ? `${stats.avgViewsPerListing} avg/listing`
        : '0 avg',
    },
    {
      label: 'Active Listings',
      value: stats?.activeListings.toString() || '0',
      icon: List,
      change: `${stats?.inactiveListings || 0} inactive`,
    },
    {
      label: 'Favorites',
      value: stats?.favoritesCount.toString() || '0',
      icon: Heart,
      change: '',
    },
    {
      label: 'Total Listings',
      value: stats?.totalListings.toString() || '0',
      icon: TrendingUp,
      change: stats?.activeListings && stats?.totalListings > 0
        ? `${Math.round((stats.activeListings / stats.totalListings) * 100)}% active`
        : '0%',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center">
        <p className="font-medium text-red-500">Failed to load dashboard stats: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 font-heading text-3xl font-black tracking-tight">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your listings today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-[2rem] border border-border/40 bg-card p-6 shadow-sm transition-all hover:border-primary/20"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-2xl bg-muted/30 p-3 transition-colors group-hover:bg-primary/10">
                <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>
              {stat.change && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-500">
                  {stat.change}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black">{stat.value}</h3>
              <p className="text-sm font-bold text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recents Placeholder */}
      <div className="flex min-h-[300px] items-center justify-center rounded-[2.5rem] border border-border/40 bg-muted/10 p-8">
        <p className="font-medium text-muted-foreground">
          Recent Activity Chart (Coming Soon)
        </p>
      </div>
    </div>
  )
}
