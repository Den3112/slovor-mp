'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users, Package, AlertCircle, Clock,
    Loader2, ShieldCheck,
    CreditCard, BarChart3, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { adminApi, type AdminStats } from '@/lib/api'
import { formatPrice } from '@/lib/utils/formatting'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ActivityChart } from '@/app/[locale]/(main)/admin/components/activity-chart' // Reuse existing chart

interface AdminOverviewViewProps {
    userEmail: string
}

export function AdminOverviewView({ userEmail }: AdminOverviewViewProps) {
    const { t } = useTranslation('common')
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            setIsLoading(true)
            try {
                const { data } = await adminApi.getDashboardStats()
                if (data) setStats(data)
            } catch (error) {
                console.error("Failed to load admin stats", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadStats()
    }, [])

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

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!stats) return null

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
            data-testid="admin-overview-view"
        >
            {/* Welcome Header */}
            <motion.div variants={item} className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-foreground">{t('admin.overview')}</h1>
                <p className="flex items-center gap-2 font-medium text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    {t('admin.systemsOperational')}. {t('admin.loggedInAs')} <span className="font-bold text-foreground">{userEmail}</span>
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label={t('admin.totalUsers')}
                    value={stats.totalUsers}
                    icon={Users}
                    trend={{ value: 12, direction: 'up', label: 'this month' }}
                    delay={0.1}
                />
                <StatsCard
                    label={t('admin.activeListings')}
                    value={stats.activeListings}
                    icon={Package}
                    trend={{ value: 5, direction: 'up', label: 'this month' }}
                    delay={0.2}
                />
                <StatsCard
                    label={t('admin.totalRevenue')}
                    value={formatPrice(stats.totalRevenue)}
                    icon={CreditCard}
                    trend={{ value: 8, direction: 'up', label: 'this month' }}
                    delay={0.3}
                />
                <StatsCard
                    label={t('admin.pendingReview')}
                    value={stats.pendingModeration}
                    icon={Clock}
                    trend={{ value: 0, direction: 'neutral', label: 'needs attention' }}
                    delay={0.4}
                    className={stats.pendingModeration > 0 ? "border-warning/50 bg-warning/5" : ""}
                />
            </motion.div>

            {/* Detailed Metrics & Action Center */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Main Chart */}
                <motion.div variants={item} className="lg:col-span-8">
                    <Card className="p-6 h-full min-h-[400px] rounded-3xl border-border bg-card">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-black tracking-tight">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                {t('admin.activityMetrics')}
                            </h3>
                            {/* Timeframe toggle placeholder */}
                            <div className="flex gap-2">
                                <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t('admin.days7')}</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">{t('admin.days30')}</span>
                            </div>
                        </div>
                        <div className="h-[300px] w-full mt-4">
                            <ActivityChart />
                        </div>
                    </Card>
                </motion.div>

                {/* Action Center */}
                <motion.div variants={item} className="space-y-6 lg:col-span-4">
                    <Card className="rounded-3xl border-border bg-card p-6">
                        <h3 className="mb-6 flex items-center gap-2 text-lg font-black tracking-tight">
                            <AlertCircle className="h-5 w-5 text-warning" />
                            {t('admin.actionCenter')}
                        </h3>
                        <div className="space-y-4">
                            <Link href="/admin/listings" className="block">
                                <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-warning/20 bg-warning/5 p-4 transition-colors hover:bg-warning/10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 font-bold text-warning">
                                            {stats.pendingModeration}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-60">{t('admin.pendingReview')}</p>
                                            <p className="text-sm font-bold">{t('admin.listingsAwaitingApproval')}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-warning opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            </Link>

                            <Link href="/admin/reports" className="block">
                                <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-primary/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                                            {stats.recentReports}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-60">{t('admin.openReports')}</p>
                                            <p className="text-sm font-bold">{t('admin.userComplaintsPending')}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            </Link>
                        </div>
                    </Card>

                    {/* Security Card */}
                    <div className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground">
                        <div className="absolute right-0 top-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                            <ShieldCheck className="h-32 w-32" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="mb-2 text-lg font-black tracking-tight">{t('admin.proSecurity')}</h3>
                            <p className="mb-6 text-sm font-medium opacity-80">{t('admin.securityAuditDesc')}</p>
                            <Button variant="secondary" size="sm" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider text-primary">
                                {t('admin.runAudit')}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
