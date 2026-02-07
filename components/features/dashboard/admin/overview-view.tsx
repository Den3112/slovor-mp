'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Package,
  AlertCircle,
  Clock,
  Loader2,
  ShieldCheck,
  CreditCard,
  BarChart3,
  Download,
  Zap,
  Layers,
  Database,
  Lock,
  RefreshCcw,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { adminApi, type AdminStats } from '@/lib/api'
import { formatPrice } from '@/lib/utils/formatting'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { ActivityChart } from './activity-chart'
import { LiveMonitor } from './live-monitor'

interface AdminOverviewViewProps {
  userEmail: string
}

export function AdminOverviewView({ userEmail }: AdminOverviewViewProps) {
  const { t, locale } = useTranslation(['common', 'admin'])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true)
      try {
        const { data } = await adminApi.getDashboardStats()
        if (data) setStats(data)
      } catch (error) {
        console.error('Failed to load admin stats', error)
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
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
      <motion.div
        variants={item}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div className="space-y-1">
          <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
            {t('admin:overview')}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
            <ShieldCheck className="text-success h-3.5 w-3.5" />
            {t('admin:systemsOperational')} •{' '}
            <span className="text-foreground/40">{t('admin:loggedInAs')}</span>{' '}
            <span className="text-foreground">{userEmail}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border/60 hover:bg-muted h-9 rounded-xl px-4 text-[10px] font-bold tracking-widest uppercase transition-all"
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            {t('common:export')}
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 h-9 rounded-xl px-4 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-all active:scale-95"
          >
            <Zap className="mr-2 h-3.5 w-3.5" />
            {t('admin:runAudit')}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          label={t('admin:totalUsers')}
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 12, direction: 'up', label: t('admin:vsLastMonth') }}
          delay={0.1}
        />
        <StatsCard
          label={t('admin:activeListings')}
          value={stats.activeListings.toLocaleString()}
          icon={Package}
          trend={{ value: 8, direction: 'up', label: t('admin:vsLastMonth') }}
          delay={0.2}
        />
        <StatsCard
          label={t('admin:revenue')}
          value={formatPrice(stats.totalRevenue)}
          icon={CreditCard}
          trend={{ value: 5, direction: 'down', label: t('admin:vsLastMonth') }}
          delay={0.3}
        />
        <StatsCard
          label={t('admin:pendingModeration')}
          value={stats.pendingModeration.toLocaleString()}
          icon={Clock}
          trend={{
            value: stats.pendingModeration > 0 ? 15 : 0,
            direction: 'neutral',
            label: t('admin:currentBacklog'),
          }}
          delay={0.4}
          className={
            stats.pendingModeration > 0
              ? 'border-amber-500/50 bg-amber-500/5'
              : ''
          }
        />
      </motion.div>

      {/* Detailed Metrics & Action Center */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Chart */}
        <motion.div variants={item} className="lg:col-span-8">
          <Card className="border-border/60 flex h-full min-h-[480px] flex-col overflow-hidden rounded-xl shadow-sm">
            <CardHeader className="border-border/40 bg-muted/20 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <BarChart3 className="text-primary h-4 w-4" />
                    {t('admin:activityMetrics')}
                  </CardTitle>
                  <p className="text-muted-foreground/40 mt-1 text-[10px] font-bold tracking-widest uppercase">
                    {t('admin:activityMetricsDesc')}
                  </p>
                </div>
                <div className="bg-muted/30 border-border/40 flex rounded-lg border p-1">
                  <button className="text-muted-foreground/60 hover:text-foreground px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors">
                    {t('admin:days7')}
                  </button>
                  <button className="bg-card text-primary border-border/40 rounded-md border px-3 py-1 text-[9px] font-bold tracking-widest uppercase shadow-sm">
                    {t('admin:days30')}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-6 pt-10">
              <ActivityChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* side monitoring column */}
        <motion.div variants={item} className="space-y-8 lg:col-span-4">
          <Card className="border-border/60 bg-card overflow-hidden rounded-xl shadow-sm">
            <CardHeader className="border-border/40 bg-muted/20 border-b px-6 py-4">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                <Zap className="text-primary h-4 w-4" />
                {t('admin:controlCenter')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              {/* Action Links */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/${locale}/admin/listings`}
                  className="bg-muted/30 border-border/40 hover:border-primary/40 hover:bg-primary/5 group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all"
                >
                  <Layers className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    {t('admin:listings')}
                  </span>
                </Link>
                <Link
                  href={`/${locale}/admin/reports`}
                  className="bg-muted/30 border-border/40 hover:border-destructive/40 hover:bg-destructive/5 group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all"
                >
                  <AlertCircle className="text-destructive h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    {t('admin:reportsTitle')}
                  </span>
                </Link>
              </div>

              <LiveMonitor />
            </CardContent>
          </Card>

          {/* System Health Panel */}
          <Card className="border-border selection:bg-primary/30 overflow-hidden rounded-xl bg-card text-foreground shadow-sm">
            <CardHeader className="border-b border-border/10 bg-muted/20 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                <ShieldCheck className="text-success h-4 w-4" />
                {t('admin:systemHealth')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/10 bg-muted/30">
                      <Database className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                      {t('admin:database')}
                    </span>
                  </div>
                  <span className="text-success border-success/20 bg-success/5 rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                    {t('admin:operational')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/10 bg-muted/30">
                      <Activity className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                      {t('admin:apiLatency')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">
                    24ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/10 bg-muted/30">
                      <Lock className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                      {t('admin:sslStatus')}
                    </span>
                  </div>
                  <span className="text-success border-success/20 bg-success/5 rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                    {t('admin:secure')}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-border/10 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-11 w-full rounded-xl border-border/60 bg-muted/10 text-[9px] font-bold tracking-widest text-muted-foreground uppercase transition-all hover:bg-muted/30 active:scale-95"
                >
                  <RefreshCcw className="mr-2 h-3 w-3" />
                  {t('admin:fullSystemReport')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
