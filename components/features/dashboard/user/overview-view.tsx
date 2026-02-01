'use client'

import { motion } from 'framer-motion'
import { Plus, ArrowRight, MessageCircle, Package, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import type { DashboardStats } from '@/lib/api/dashboard-stats'
import { AnalyticsChart } from '@/components/profile/analytics-chart'
import { ActivityFeed } from '@/components/profile/activity-feed'
import { ListingRowActions } from '@/components/features/dashboard/user/components/listing-row-actions'
import { cn } from '@/lib/utils'

interface UserOverviewViewProps {
    user: any
    stats: DashboardStats
    userListings: any[]
    chartData: any[]
}

export function UserOverviewView({
    user,
    stats,
    userListings,
    chartData,
}: UserOverviewViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing', 'profile'])

    return (
        <div
            className="space-y-6"
            data-testid="profile-overview-view"
        >
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {t('common:dashboard')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('dashboard:welcomeBack')},{' '}
                        {user.user_metadata.full_name || user.email?.split('@')[0]}!
                    </p>
                </div>
                <Button asChild>
                    <Link href="/post">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Link href="/profile/listings">
                    <StatsCard
                        label={t('dashboard:active')}
                        value={stats.activeListings}
                        icon={Package}
                        delay={0.05}
                    />
                </Link>
                <Link href="/profile/listings">
                    <StatsCard
                        label={t('dashboard:views')}
                        value={stats.totalViews}
                        icon={Eye}
                        delay={0.1}
                        trend={{ value: 12, direction: 'up' }}
                    />
                </Link>
                <Link href="/profile/favorites">
                    <StatsCard
                        label={t('dashboard:favorites')}
                        value={stats.favorites}
                        icon={Heart}
                        delay={0.15}
                    />
                </Link>
                <Link href="/profile/messages">
                    <StatsCard
                        label={t('profile:inbox')}
                        value={stats.messages}
                        icon={MessageCircle}
                        delay={0.2}
                    />
                </Link>
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Chart */}
                <Card className="lg:col-span-2 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold">{t('dashboard:performance')}</h2>
                            <p className="text-xs text-muted-foreground">{t('dashboard:viewsOverTime')}</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <AnalyticsChart data={chartData} />
                    </div>
                </Card>

                {/* Activity Feed */}
                <Card className="flex flex-col p-6">
                    <h2 className="font-semibold mb-4">{t('dashboard:activityFeed')}</h2>
                    <div className="flex-1 overflow-auto">
                        <ActivityFeed />
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
                        <Link href="/profile/messages">
                            {t('common:viewAll')}
                        </Link>
                    </Button>
                </Card>
            </div>

            {/* Recent Listings */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold">{t('dashboard:recentActivity')}</h2>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/profile/listings">
                            {t('common:viewAll')}
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>

                {userListings && userListings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {userListings.slice(0, 3).map((listing, i) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                            >
                                <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 p-4">
                                        <Link
                                            href={`/listings/${listing.id}`}
                                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted"
                                        >
                                            {listing.images?.[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                            )}
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/listings/${listing.id}`}
                                                className="block truncate font-medium hover:text-primary transition-colors"
                                            >
                                                {listing.title}
                                            </Link>
                                            <p className="text-sm font-semibold text-success">
                                                {listing.price} {listing.currency}
                                            </p>
                                            <span
                                                className={cn(
                                                    'inline-block rounded px-1.5 py-0.5 text-[10px] font-medium',
                                                    listing.is_active
                                                        ? 'bg-success/10 text-success'
                                                        : 'bg-muted text-muted-foreground'
                                                )}
                                            >
                                                {listing.is_active ? t('dashboard:active') : t('dashboard:inactive')}
                                            </span>
                                        </div>
                                        <ListingRowActions listing={listing} />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="flex h-40 flex-col items-center justify-center border-dashed text-center">
                        <p className="text-muted-foreground">{t('dashboard:noListingsYet')}</p>
                        <Button variant="link" asChild className="mt-2">
                            <Link href="/post">{t('createListing:publish')}</Link>
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    )
}
