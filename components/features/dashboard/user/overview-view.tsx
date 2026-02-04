'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, ArrowRight, MessageCircle, Package, Heart, Eye, TrendingUp, CreditCard } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart'
import { ActivityFeed } from '@/components/seller-profile/activity-feed'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface UserOverviewViewProps {
    user: any
    stats: DashboardStats
    userListings: any[]
    chartData: any[]
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function UserOverviewView({
    user,
    stats,
    userListings,
    chartData,
}: UserOverviewViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing', 'profile'])

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
            data-testid="profile-overview-view"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{t('common:dashboard')}</h1>
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('dashboard:welcomeBack')}, <span className="text-foreground">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="hidden sm:flex text-[10px] font-bold uppercase tracking-widest rounded-xl border-border/60 h-10 px-6">
                        <Link href="/dashboard/settings">{t('profile:settings')}</Link>
                    </Button>
                    <Button asChild className="shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest rounded-xl px-6 h-10">
                        <Link href="/post">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('createListing:publish')}
                        </Link>
                    </Button>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-6">
                <Link href="/dashboard/listings">
                    <StatsCard
                        label={t('dashboard:active')}
                        value={stats.activeListings.toLocaleString()}
                        icon={Package}
                        delay={0.1}
                    />
                </Link>
                <Link href="/dashboard/listings">
                    <StatsCard
                        label={t('dashboard:views')}
                        value={stats.totalViews.toLocaleString()}
                        icon={Eye}
                        trend={{ value: 12, direction: 'up', label: t('dashboard:thisWeek') }}
                        delay={0.2}
                    />
                </Link>
                <Link href="/dashboard/wallet">
                    <StatsCard
                        label={t('profile:wallet')}
                        value={`${(stats.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${stats.walletCurrency || 'EUR'}`}
                        icon={CreditCard}
                        description={t('dashboard:walletDetails.availableBalance')}
                        className="bg-primary/3 border-primary/20"
                        delay={0.3}
                    />
                </Link>
                <Link href="/favorites">
                    <StatsCard
                        label={t('dashboard:favorites')}
                        value={stats.favorites.toLocaleString()}
                        icon={Heart}
                        delay={0.4}
                    />
                </Link>
                <Link href="/messages">
                    <StatsCard
                        label={t('profile:inbox')}
                        value={stats.messages.toLocaleString()}
                        icon={MessageCircle}
                        delay={0.5}
                    />
                </Link>
            </motion.div>

            {/* Content Row: Chart (2/3) + Activity (1/3) */}
            <div className="grid gap-8 lg:grid-cols-3">
                <motion.div variants={item} className="lg:col-span-2 space-y-4">
                    <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden rounded-xl">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        {t('dashboard:performance')}
                                    </CardTitle>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">{t('dashboard:viewsOverTime')}</p>
                                </div>
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/60">
                                    Last 7 Days
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-8 min-h-[320px]">
                            <AnalyticsChart data={chartData} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item} className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl bg-card">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                {t('dashboard:quickActions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 grid gap-2">
                            <Button variant="outline" className="justify-start gap-3 h-11 font-bold text-[10px] uppercase tracking-widest border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all group/btn rounded-xl" asChild>
                                <Link href="/post">
                                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-colors">
                                        <Plus className="h-3.5 w-3.5" />
                                    </div>
                                    {t('createListing:publish')}
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start gap-3 h-11 font-bold text-[10px] uppercase tracking-widest border-border/60 hover:bg-success/5 hover:text-success hover:border-success/30 transition-all group/btn rounded-xl">
                                <div className="p-1.5 rounded-lg bg-success/10 text-success group-hover/btn:bg-success group-hover/btn:text-white transition-colors">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                </div>
                                {t('dashboard:promoteListings')}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden h-full rounded-xl">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                {t('dashboard:activityFeed')}
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary">
                                <Link href="/messages">{t('common:viewAll')}</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 overflow-auto max-h-[450px]">
                            <ActivityFeed />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Listings Table */}
            <motion.div variants={item}>
                <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl">
                    <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {t('dashboard:recentActivity')}
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 hover:text-primary transition-colors">
                            <Link href="/dashboard/listings" className="gap-2 text-[10px] font-bold uppercase tracking-widest">
                                {t('common:viewAll')} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {userListings && userListings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent bg-muted/20 border-b border-border/40">
                                            <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t('createListing:title')}</TableHead>
                                            <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t('createListing:price')}</TableHead>
                                            <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t('dashboard:status')}</TableHead>
                                            <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 text-right">{t('common:actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userListings.slice(0, 5).map((listing) => (
                                            <TableRow key={listing.id} className="hover:bg-accent/40 transition-colors group">
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/10">
                                                            {listing.images?.[0] ? (
                                                                <Image
                                                                    src={listing.images[0]}
                                                                    alt={listing.title}
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <Package className="m-auto h-6 w-6 text-muted-foreground/40" />
                                                            )}
                                                        </div>
                                                        <Link href={`/listings/${listing.id}`} className="font-bold text-sm hover:text-primary transition-colors truncate max-w-[240px]">
                                                            {listing.title}
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="font-heading text-base font-black tracking-tight">
                                                        {listing.price} {listing.currency}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <Badge
                                                        variant={listing.is_active ? 'success' : 'secondary'}
                                                        className="rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                                                    >
                                                        {listing.is_active ? t('dashboard:active') : t('dashboard:inactive')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                                                        <Link href={`/post?edit=${listing.id}`}>
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex h-48 flex-col items-center justify-center text-center p-6">
                                <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-4">
                                    <Package className="h-6 w-6 text-muted-foreground/40" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('dashboard:noListingsYet')}</p>
                                <Button variant="outline" size="sm" asChild className="rounded-xl border-border/60 text-[10px] font-bold uppercase tracking-widest">
                                    <Link href="/post">{t('createListing:publish')}</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
