'use client'

import { motion } from 'framer-motion'
import { Plus, ArrowRight, BarChart3, Package, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import type { DashboardStats } from '@/lib/api/dashboard-stats'
import { AnalyticsChart } from '@/components/profile/analytics-chart' // Reuse existing chart
import { ActivityFeed } from '@/components/profile/activity-feed' // Reuse existing feed
import { ListingRowActions } from '@/components/features/dashboard/user/components/listing-row-actions'
import { cn } from '@/lib/utils'

interface UserOverviewViewProps {
    user: any // Supabase user type
    stats: DashboardStats
    userListings: any[] // Listing type
    chartData: any[]
}

export function UserOverviewView({
    user,
    stats,
    userListings,
    chartData,
}: UserOverviewViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing'])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
            data-testid="profile-overview-view"
        >
            {/* Header Section */}
            <motion.div variants={item} className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {t('common:dashboard')}
                    </h1>
                    <p className="mt-1 font-medium text-muted-foreground">
                        {t('dashboard:welcomeBack')},{' '}
                        {user.user_metadata.full_name || user.email?.split('@')[0]}!
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20">
                    <Link href="/post">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/profile/listings">
                    <StatsCard
                        label={t('dashboard:active')}
                        value={stats.activeListings}
                        icon={Package}
                        delay={0.1}
                        className="h-full bg-card/50 hover:bg-card"
                    />
                </Link>
                <Link href="/profile/listings">
                    <StatsCard
                        label={t('dashboard:views')}
                        value={stats.totalViews}
                        icon={Eye}
                        delay={0.2}
                        trend={{ value: 12, direction: 'up' }} // Mock trend
                        className="h-full bg-card/50 hover:bg-card"
                    />
                </Link>
                <Link href="/profile/favorites">
                    <StatsCard
                        label={t('dashboard:favorites')}
                        value={stats.favorites}
                        icon={Heart}
                        delay={0.3}
                        className="h-full bg-card/50 hover:bg-card"
                    />
                </Link>
                {/* Fourth stat example - Messages */}
                <Link href="/profile/messages">
                    <StatsCard
                        label={t('profile:inbox')}
                        value={stats.messages}
                        icon={BarChart3} // MessageCircle icon?
                        delay={0.4}
                        className="h-full bg-card/50 hover:bg-card"
                    />
                </Link>
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Chart */}
                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="relative overflow-hidden rounded-3xl border-border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-heading text-lg font-black tracking-tight">
                                    {t('dashboard:performance')}
                                </h2>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {t('dashboard:viewsOverTime')}
                                </p>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <AnalyticsChart data={chartData} />
                        </div>
                    </Card>
                </motion.div>

                {/* Activity Feed */}
                <motion.div variants={item} className="lg:col-span-1">
                    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-border bg-card p-6 shadow-sm">
                        <h2 className="font-heading mb-4 text-lg font-black tracking-tight">{t('dashboard:activityFeed')}</h2>
                        <ActivityFeed />
                        <Button variant="ghost" className="mt-auto w-full text-xs" asChild>
                            <Link href="/profile/messages">
                                {t('common:viewAll')}
                            </Link>
                        </Button>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Listings Grid */}
            <motion.div variants={item}>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-black tracking-tight">{t('dashboard:recentActivity')}</h2> {/* Using recentActivity label for Listings as per old design? Or My Listings */}
                    <Button variant="link" asChild className="text-muted-foreground">
                        <Link href="/profile/listings">
                            {t('common:viewAll')} <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>

                {userListings && userListings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {userListings.slice(0, 3).map((listing, i) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i }}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md"
                            >
                                <div className="flex items-center gap-4 p-4">
                                    <Link href={`/listings/${listing.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                                        {listing.images?.[0] ? (
                                            <Image
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                unoptimized
                                            />
                                        ) : ( // Fallback
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <Package className="h-6 w-6" />
                                            </div>
                                        )}
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/listings/${listing.id}`} className="block truncate font-bold hover:text-primary transition-colors">
                                            {listing.title}
                                        </Link>
                                        <p className="text-sm font-medium text-emerald-600">
                                            {listing.price} {listing.currency}
                                        </p>
                                        <span className={cn(
                                            "inline-block rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider",
                                            listing.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                                        )}>
                                            {listing.is_active ? t('dashboard:active') : t('dashboard:inactive')}
                                        </span>
                                    </div>
                                    <ListingRowActions listing={listing} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 text-center">
                        <p className="text-muted-foreground font-medium">{t('dashboard:noListingsYet')}</p>
                        <Button variant="link" asChild className="mt-2" >
                            <Link href="/post">{t('createListing:publish')}</Link>
                        </Button>
                    </div>
                )}
            </motion.div>

        </motion.div>
    )
}
