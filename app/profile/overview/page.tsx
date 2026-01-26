import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getTranslationServer } from '@/lib/i18n/server'
import { ListingRowActions } from '@/components/profile/listing-row-actions'
import { listingsApi } from '@/lib/api'
import {
  Package,
  BarChart3,
  Heart,
  Plus,
  ArrowRight,
} from 'lucide-react'

import { getDashboardStats } from '@/lib/api/dashboard-stats'
import { AnalyticsChart } from '@/components/profile/analytics-chart'
import { ActivityFeed } from '@/components/profile/activity-feed'

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

  // Generate mock chart data for the last 7 days binary stats
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString([], { weekday: 'short' }),
      value: Math.floor((totalViews / 10) * (0.8 + Math.random() * 0.4)),
    }
  })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-black tracking-tight">
            {t.common.dashboard}
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            {t.dashboard.welcomeBack},{' '}
            {user.user_metadata.full_name || user.email?.split('@')[0]}!
          </p>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        {/* Active Listings */}
        <Link href="/profile/my-listings" className="block">
          <Card className="hover:shadow-primary/10 group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl md:rounded-5xl md:p-6">
            <div className="from-primary/10 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="bg-primary/10 text-primary mb-3 rounded-xl p-3 shadow-inner md:mb-4 md:rounded-2xl md:p-4">
                <Package className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-foreground mb-0.5 text-3xl font-black tracking-tighter md:mb-1 md:text-5xl">
                  {activeListings}
                </h3>
                <span className="text-emerald-500 text-[10px] font-bold md:text-xs">
                  +2
                </span>
              </div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                {t.dashboard.active}
              </p>
            </div>
          </Card>
        </Link>

        {/* Total Views */}
        <Link href="/profile/my-listings" className="block">
          <Card className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 md:rounded-5xl md:p-6">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-3 rounded-xl bg-emerald-500/10 p-3 text-emerald-600 shadow-inner md:mb-4 md:rounded-2xl md:p-4">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-foreground mb-0.5 text-3xl font-black tracking-tighter md:mb-1 md:text-5xl">
                  {totalViews}
                </h3>
                <span className="text-emerald-500 text-[10px] font-bold md:text-xs">
                  +12%
                </span>
              </div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                {t.dashboard.views}
              </p>
            </div>
          </Card>
        </Link>

        {/* Favorites */}
        <Link
          href="/profile/favorites"
          className="col-span-2 block md:col-span-1"
        >
          <Card className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-rose-500/10 md:rounded-5xl md:p-6">
            <div className="absolute inset-0 bg-linear-to-br from-rose-500/10 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-3 rounded-xl bg-rose-500/10 p-3 text-rose-600 shadow-inner md:mb-4 md:rounded-2xl md:p-4">
                <Heart className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-foreground mb-0.5 text-3xl font-black tracking-tighter md:mb-1 md:text-5xl">
                  {favoritesCount}
                </h3>
                <span className="text-rose-500 text-[10px] font-bold md:text-xs">
                  +5
                </span>
              </div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                {t.dashboard.favorites}
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Analytics Visualization Section */}
      <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl md:rounded-5xl md:p-8">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent" />
        <div className="relative z-10 mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-xl font-black tracking-tight md:text-2xl">
              {t.dashboard.performance}
            </h2>
            <p className="text-muted-foreground text-xs font-medium md:text-sm">
              {t.dashboard.viewsOverTime} • {t.dashboard.pastDays}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-emerald-600">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              +12.5% {t.dashboard.growth}
            </span>
          </div>
        </div>

        <div className="relative h-[250px] w-full">
          <AnalyticsChart data={chartData} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-2">
        {/* Recent Listings */}
        <Card className="relative ml-0 flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:rounded-5xl md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-xl font-black tracking-tight md:text-2xl">
                {t.dashboard.myListings}
              </h2>
              <p className="text-muted-foreground text-xs font-medium md:text-sm">
                {t.dashboard.recentActivity}
              </p>
            </div>
            <Link
              href="/profile/my-listings"
              className="group/btn text-muted-foreground hover:text-primary flex items-center gap-2 text-xs font-bold transition-colors"
            >
              {t.common.viewAll}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center">
            {userListings.data && userListings.data.length > 0 ? (
              <div className="flex flex-1 flex-col gap-3">
                <div className="space-y-3">
                  {userListings.data.slice(0, 3).map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-background/40 hover:bg-background/60 hover:border-primary/20 group relative z-10 flex w-full items-center gap-3 rounded-2xl border border-white/5 p-3 transition-all duration-300 hover:shadow-lg md:gap-4 md:rounded-[1.25rem] md:p-3"
                    >
                      {/* Clickable Area */}
                      <Link
                        href={`/listings/${listing.id}`}
                        className="group/link flex min-w-0 flex-1 items-center gap-3 md:gap-4"
                      >
                        <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-xl shadow-inner md:h-14 md:w-14 md:rounded-2xl">
                          {listing.images?.[0] ? (
                            <Image
                              src={listing.images[0]}
                              alt={listing.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/link:scale-110"
                              unoptimized
                            />
                          ) : (
                            <div className="bg-primary/5 text-primary/40 flex h-full w-full items-center justify-center">
                              <Package className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-foreground group-hover/link:text-primary mb-0.5 truncate text-sm font-bold transition-colors md:text-base">
                            {listing.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground text-xs font-medium">
                              {listing.price} {listing.currency}
                            </p>
                            <span
                              className={cn(
                                'rounded-md border px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase shadow-sm',
                                listing.is_active
                                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                                  : 'bg-muted text-muted-foreground border-border/50'
                              )}
                            >
                              {listing.is_active ? t.dashboard.active : t.dashboard.inactive}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Actions */}
                      <ListingRowActions listing={listing} />
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex justify-center pt-4">
                  <Link
                    href="/profile/my-listings"
                    className="group/btn text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors"
                  >
                    {t.common.viewAll}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center py-8 text-center">
                <div className="mobile:h-20 mobile:w-20 bg-primary/5 mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
                  <Plus className="text-primary/40 h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="mb-2 text-lg font-black md:text-xl">
                  {t.dashboard.noListingsYet}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-[220px] text-xs leading-relaxed font-medium md:mb-8 md:text-sm">
                  {t.dashboard.startSelling}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="shadow-primary/25 hover:shadow-primary/40 rounded-2xl px-6 py-5 text-sm font-bold shadow-xl transition-all hover:scale-105 md:px-8 md:py-6 md:text-base"
                >
                  <Link href="/post">{t.createListing.publish}</Link>
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Activity Feed Card */}
        <Card className="via-background/60 to-background/60 group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/5 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl md:min-h-auto md:rounded-5xl md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />

          <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href="/profile/messages"
                  className="font-heading hover:text-primary flex items-center gap-2 text-xl font-black tracking-tight transition-colors md:text-2xl"
                >
                  {t.dashboard.activityFeed}
                </Link>
                <span className="bg-primary text-primary-foreground shadow-primary/20 flex animate-pulse items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg">
                  3 {t.dashboard.new}
                </span>
              </div>
              <p className="text-muted-foreground text-xs font-medium md:text-sm">
                {t.dashboard.recentActivity}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-1 flex-col">
            <ActivityFeed />
            <div className="mt-auto flex justify-center pt-6">
              <Link
                href="/profile/messages"
                className="group/btn text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors"
              >
                {t.common.viewAll}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
