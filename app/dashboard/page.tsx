'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { motion } from 'framer-motion'
import {
  Eye,
  List,
  Heart,
  TrendingUp,
  Loader2,
  Plus,
  Settings,
  Clock,
  Sparkles
} from 'lucide-react'
import { dashboardApi, profilesApi } from '@/lib/api'
import type { DashboardStats } from '@/lib/api/dashboard'
import type { Listing, User as UserProfile } from '@/lib/types/database'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<Listing[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        const [statsRes, activityRes, profileRes] = await Promise.all([
          dashboardApi.getStats(user.id),
          dashboardApi.getRecentActivity(user.id),
          profilesApi.getById(user.id)
        ])

        if (statsRes.error) throw new Error(statsRes.error)

        setStats(statsRes.data)
        setRecentActivity(activityRes.data || [])
        setProfile(profileRes.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const statsData = [
    {
      label: 'Total Views',
      value: stats?.totalViews.toLocaleString() || '0',
      icon: Eye,
      change: stats?.avgViewsPerListing
        ? `${stats.avgViewsPerListing} avg/listing`
        : '0 avg',
      color: 'blue'
    },
    {
      label: 'Active Listings',
      value: stats?.activeListings.toString() || '0',
      icon: List,
      change: `${stats?.inactiveListings || 0} inactive`,
      color: 'emerald'
    },
    {
      label: 'Favorites',
      value: stats?.favoritesCount.toString() || '0',
      icon: Heart,
      change: '',
      color: 'rose'
    },
    {
      label: 'Total Listings',
      value: stats?.totalListings.toString() || '0',
      icon: TrendingUp,
      change: stats?.activeListings && (stats?.totalListings || 0) > 0
        ? `${Math.round((stats.activeListings / stats.totalListings) * 100)}% active`
        : '0%',
      color: 'violet'
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Container>
      <div className="space-y-10 pb-20 pt-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-heading text-4xl font-black tracking-tight text-foreground">
              Hi, {profile?.display_name || user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&apos;s a quick overview of your marketplace activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/post">
              <Button className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/25">
                <Plus className="mr-2 h-4 w-4" />
                Post New Ad
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="h-12 w-12 rounded-2xl border-border/40 p-0 hover:bg-muted/50">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between">
                  <div className={cn(
                    "rounded-2xl p-4 transition-colors group-hover:scale-110",
                    stat.color === 'blue' && "bg-blue-500/10 text-blue-500",
                    stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                    stat.color === 'rose' && "bg-rose-500/10 text-rose-500",
                    stat.color === 'violet' && "bg-violet-500/10 text-violet-500",
                  )}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  {stat.change && (
                    <span className="rounded-full bg-muted/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-5xl font-black tracking-tighter">{stat.value}</h3>
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-widest">
                <Clock className="h-5 w-5 text-primary" />
                Recent Updates
              </h3>
              <Link href="/dashboard/listings" className="text-sm font-bold text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center gap-4 rounded-3xl border border-border/40 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                      {listing.images?.[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <List className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                          {listing.category?.name || 'Item'}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {new Date(listing.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="truncate font-bold text-lg group-hover:text-primary transition-colors">
                        {listing.title}
                      </h4>
                      <p className="text-sm font-black text-foreground/80">
                        {listing.price.toLocaleString()} {listing.currency}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 pr-2">
                      <span className={cn(
                        "rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest",
                        listing.is_active
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      )}>
                        {listing.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {listing.views}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/50 bg-muted/5 p-8 text-center">
                  <Sparkles className="mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="font-bold text-muted-foreground">No recent activity yet.</p>
                  <Link href="/post" className="mt-4 text-sm font-black uppercase tracking-widest text-primary hover:underline">
                    Create your first ad
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-widest px-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/favorites" className="group rounded-[2rem] border border-border/40 bg-card p-6 transition-all hover:border-rose-500/30 hover:shadow-xl hover:shadow-rose-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 transition-transform group-hover:scale-110">
                  <Heart className="h-6 w-6" />
                </div>
                <h4 className="mb-1 font-bold">Saved Items</h4>
                <p className="text-xs text-muted-foreground">Items you&apos;re keeping an eye on.</p>
              </Link>

              <Link href="/dashboard/settings" className="group rounded-[2rem] border border-border/40 bg-card p-6 transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
                  <Settings className="h-6 w-6" />
                </div>
                <h4 className="mb-1 font-bold">Account Settings</h4>
                <p className="text-xs text-muted-foreground">Manage your profile and security.</p>
              </Link>

              <div className="rounded-[2.5rem] bg-gradient-to-br from-primary to-violet-600 p-8 text-white shadow-2xl shadow-primary/20">
                <Sparkles className="mb-6 h-10 w-10 text-white/40" />
                <h4 className="mb-2 text-xl font-black italic">Sell faster!</h4>
                <p className="mb-6 text-sm font-medium text-white/80">
                  Ads with high-quality photos get 5x more views than those without.
                </p>
                <Link href="/post">
                  <Button className="w-full rounded-2xl bg-white font-black text-primary hover:bg-white/90">
                    Post New Ad
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="font-medium text-red-500">Failed to load dashboard data: {error}</p>
          </div>
        )}
      </div>
    </Container>
  )
}
