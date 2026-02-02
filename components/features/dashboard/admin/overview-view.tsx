'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users, Package, AlertCircle, Clock,
    Loader2, ShieldCheck,
    CreditCard, BarChart3,
    Download, Zap, Layers, Database, Lock, RefreshCcw, Activity
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { adminApi, type AdminStats } from '@/lib/api'
import { formatPrice } from '@/lib/utils/formatting'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { ActivityChart } from '@/app/[locale]/(main)/admin/components/activity-chart' // Reuse existing chart
import { LiveMonitor } from '@/app/[locale]/(main)/admin/components/live-monitor'

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
            className="space-y-10"
            data-testid="admin-overview-view"
        >
            {/* Header section with refined typography */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{t('admin:overview')}</h1>
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-success" />
                        {t('admin:systemsOperational')} • <span className="text-foreground/40">{t('admin:loggedInAs')}</span> <span className="text-foreground">{userEmail}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-border/60 h-9 px-4 rounded-xl hover:bg-muted transition-all">
                        <Download className="h-3.5 w-3.5 mr-2" />
                        {t('common:export')}
                    </Button>
                    <Button size="sm" className="text-[10px] font-black uppercase tracking-widest shadow-sm bg-primary h-9 px-4 rounded-xl hover:bg-primary/90 transition-all active:scale-95">
                        <Zap className="h-3.5 w-3.5 mr-2" />
                        {t('admin:runAudit')}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label={t('admin.totalUsers')}
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend={{ value: 12, direction: 'up', label: 'vs last month' }}
                    delay={0.1}
                />
                <StatsCard
                    label={t('admin.activeListings')}
                    value={stats.activeListings.toLocaleString()}
                    icon={Package}
                    trend={{ value: 8, direction: 'up', label: 'vs last month' }}
                    delay={0.2}
                />
                <StatsCard
                    label={t('admin.revenue')}
                    value={formatPrice(stats.totalRevenue)}
                    icon={CreditCard}
                    trend={{ value: 5, direction: 'down', label: 'vs last month' }}
                    delay={0.3}
                />
                <StatsCard
                    label={t('admin.pendingModeration')}
                    value={stats.pendingModeration.toLocaleString()}
                    icon={Clock}
                    trend={{ value: stats.pendingModeration > 0 ? 15 : 0, direction: 'neutral', label: 'Current backlog' }}
                    delay={0.4}
                    className={stats.pendingModeration > 0 ? "border-amber-500/50 bg-amber-500/5" : ""}
                />
            </motion.div>

            {/* Detailed Metrics & Action Center */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Main Chart */}
                <motion.div variants={item} className="lg:col-span-8">
                    <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden h-full min-h-[480px] rounded-xl">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                        {t('admin:activityMetrics')}
                                    </CardTitle>
                                    <p className="text-[10px] text-muted-foreground/40 mt-1 uppercase tracking-widest font-black">{t('admin:activityMetricsDesc') || 'Global Traffic & Conversion'}</p>
                                </div>
                                <div className="flex bg-muted/30 p-1 rounded-lg border border-border/40">
                                    <button className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors">{t('admin.days7')}</button>
                                    <button className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-card text-primary rounded-md shadow-sm border border-border/40">{t('admin.days30')}</button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-12 flex-1 flex items-center justify-center">
                            <ActivityChart />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* side monitoring column */}
                <motion.div variants={item} className="space-y-8 lg:col-span-4">
                    <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl bg-card">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                {t('admin:controlCenter')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Action Links */}
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/admin/listings"
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-center group"
                                >
                                    <Layers className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin.listings')}</span>
                                </Link>
                                <Link
                                    href="/admin/reports"
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-destructive/40 hover:bg-destructive/5 transition-all text-center group"
                                >
                                    <AlertCircle className="h-5 w-5 text-destructive transition-transform group-hover:scale-110" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin.reportsTitle')}</span>
                                </Link>
                            </div>

                            <LiveMonitor />
                        </CardContent>
                    </Card>

                    {/* System Health Panel */}
                    <Card className="border-border rounded-xl overflow-hidden bg-slate-950 text-white selection:bg-primary/30 shadow-sm border-none">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-success" />
                                System Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                            <Database className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Database</span>
                                    </div>
                                    <span className="text-[10px] font-black text-success uppercase tracking-widest px-2 py-0.5 rounded-sm border border-success/20 bg-success/5">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                            <Activity className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white/40">API Latency</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">24ms</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                            <Lock className="h-4 w-4 text-amber-400" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white/40">SSL Status</span>
                                    </div>
                                    <span className="text-[10px] font-black text-success uppercase tracking-widest px-2 py-0.5 rounded-sm border border-success/20 bg-success/5">Secure</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 mt-4">
                                <Button size="sm" className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl h-11 text-[9px] font-black uppercase tracking-widest border-0 transition-all active:scale-95">
                                    <RefreshCcw className="h-3 w-3 mr-2" />
                                    Full System Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    )
}
