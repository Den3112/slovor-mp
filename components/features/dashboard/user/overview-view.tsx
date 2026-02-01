'use client'

import Link from 'next/link'
import { Plus, ArrowRight, MessageCircle, Package, Heart, Eye } from 'lucide-react'
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
import { AnalyticsChart } from '@/components/profile/analytics-chart'
import { ActivityFeed } from '@/components/profile/activity-feed'
import type { DashboardStats } from '@/lib/api/dashboard-stats'

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

    const StatCard = ({ label, value, icon: Icon }: { label: string, value: number, icon: any }) => (
        <Card className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </Card>
    )

    return (
        <div className="space-y-6" data-testid="profile-overview-view">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('common:dashboard')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('dashboard:welcomeBack')}, {user.user_metadata.full_name || user.email?.split('@')[0]}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/post">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Link href="/profile/listings">
                    <StatCard label={t('dashboard:active')} value={stats.activeListings} icon={Package} />
                </Link>
                <Link href="/profile/listings">
                    <StatCard label={t('dashboard:views')} value={stats.totalViews} icon={Eye} />
                </Link>
                <Link href="/profile/favorites">
                    <StatCard label={t('dashboard:favorites')} value={stats.favorites} icon={Heart} />
                </Link>
                <Link href="/profile/messages">
                    <StatCard label={t('profile:inbox')} value={stats.messages} icon={MessageCircle} />
                </Link>
            </div>

            {/* Content Row: Chart (2/3) + Activity (1/3) */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">{t('dashboard:performance')}</CardTitle>
                        <p className="text-xs text-muted-foreground">{t('dashboard:viewsOverTime')}</p>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <AnalyticsChart data={chartData} />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">{t('dashboard:activityFeed')}</CardTitle>
                        <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                            <Link href="/profile/messages">{t('common:viewAll')}</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto max-h-[350px]">
                        <ActivityFeed />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Listings Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base font-medium">{t('dashboard:recentActivity')}</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/profile/listings" className="gap-2 text-xs">
                            {t('common:viewAll')} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {userListings && userListings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[300px]">{t('createListing:title')}</TableHead>
                                    <TableHead>{t('createListing:price')}</TableHead>
                                    <TableHead>{t('dashboard:status')}</TableHead>
                                    <TableHead className="text-right">{t('common:actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userListings.slice(0, 5).map((listing) => (
                                    <TableRow key={listing.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Link href={`/listings/${listing.id}`} className="hover:text-primary transition-colors block truncate w-48">
                                                    {listing.title}
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-sm">{listing.price} {listing.currency}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={listing.is_active ? 'success' : 'secondary'} className="rounded-md font-normal">
                                                {listing.is_active ? t('dashboard:active') : t('dashboard:inactive')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                                                <Link href={`/profile/listings/edit/${listing.id}`}>
                                                    <span className="sr-only">Edit</span>
                                                    <div className="h-4 w-4 rounded-full bg-primary/20" /> {/* Placeholder for edit icon/action */}
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex h-32 flex-col items-center justify-center text-center">
                            <p className="text-sm text-muted-foreground mb-2">{t('dashboard:noListingsYet')}</p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/post">{t('createListing:publish')}</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
