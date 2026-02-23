'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Zap,
  Download,
  Calendar,
  ArrowUpRight,
  Layers,
  Map,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ActivityChart } from '../activity-chart'

export function AdminAnalyticsView() {
  const { t } = useTranslation(['common', 'admin'])
  const [timeRange, setTimeRange] = useState('30d')

  // Mock data for analytics
  const growthStats = [
    {
      label: t('admin:conversionRate'),
      value: '4.2%',
      trend: '+0.8%',
      positive: true,
      icon: TrendingUp,
    },
    {
      label: t('admin:avgOrderValue'),
      value: '€124',
      trend: '+12%',
      positive: true,
      icon: ShoppingBag,
    },
    {
      label: t('admin:churnRate'),
      value: '2.1%',
      trend: '-0.3%',
      positive: true,
      icon: Users,
    },
    {
      label: t('admin:sessionDuration'),
      value: '5:24',
      trend: '-2%',
      positive: false,
      icon: Zap,
    },
  ]

  const categoryPerformance = [
    {
      name: t('admin:catVehicles'),
      listings: 1240,
      growth: '+15%',
      color: 'bg-blue-500',
    },
    {
      name: t('admin:catElectronics'),
      listings: 850,
      growth: '+8%',
      color: 'bg-emerald-500',
    },
    {
      name: t('admin:catRealEstate'),
      listings: 620,
      growth: '+22%',
      color: 'bg-amber-500',
    },
    {
      name: t('admin:catServices'),
      listings: 430,
      growth: '-2%',
      color: 'bg-rose-500',
    },
  ]

  const topRegions = [
    { name: t('admin:regionNorth'), share: 45, value: '€45k' },
    { name: t('admin:regionSouth'), share: 22, value: '€22k' },
    { name: t('admin:regionEast'), share: 18, value: '€18k' },
    { name: t('admin:regionWest'), share: 15, value: '€15k' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <BarChart3 className="text-primary h-8 w-8" />
            {t('admin:analyticsDashboard')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:deepDivePerformance')}
          </p>
        </div>
        <div className="bg-muted/40 border-border/40 flex items-center gap-3 rounded-xl border p-1">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn(
                'h-auto rounded-xl px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all',
                timeRange === range
                  ? 'bg-background text-primary border-border/40 hover:bg-background hover:text-primary border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {range}
            </Button>
          ))}
          <div className="bg-border/40 mx-1 h-4 w-px" />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-background h-8 w-8 rounded-xl transition-all"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {growthStats.map((stat, idx) => (
          <Card
            key={idx}
            className="border-border/60 flex flex-col justify-between rounded-xl p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="bg-muted/50 border-border/40 rounded-xl border p-2.5">
                <stat.icon className="text-primary h-4 w-4" />
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-md py-0.5 text-[9px] font-bold tracking-widest uppercase',
                  stat.positive
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                )}
              >
                {stat.trend}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                {stat.label}
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                {stat.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Traffic Chart */}
        <Card className="border-border/60 flex min-h-[400px] flex-col overflow-hidden rounded-xl shadow-sm lg:col-span-2">
          <CardHeader className="border-border/40 bg-muted/20 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Zap className="text-primary h-4 w-4" />
                {t('admin:userTrafficListings')}
              </CardTitle>
              <Calendar className="text-muted-foreground/40 h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-8">
            <ActivityChart />
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-border/60 flex flex-col overflow-hidden rounded-xl shadow-sm">
          <CardHeader className="border-border/40 bg-muted/20 border-b px-6 py-4">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              <Layers className="text-primary h-4 w-4" />
              {t('admin:categoryPerformance')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {categoryPerformance.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">
                    {cat.listings.toLocaleString()} {t('admin:items')}
                  </span>
                </div>
                <div className="bg-muted/30 border-border/10 relative h-1.5 w-full overflow-hidden rounded-full border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(cat.listings / (categoryPerformance[0]?.listings || 1)) * 100}%`,
                    }}
                    transition={{
                      duration: 1.2,
                      ease: 'circOut',
                      delay: idx * 0.1,
                    }}
                    className={cn(
                      'h-full rounded-full transition-all',
                      cat.color
                    )}
                  />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-[9px] font-bold uppercase',
                    cat.growth.startsWith('+')
                      ? 'text-success'
                      : 'text-destructive'
                  )}
                >
                  <ArrowUpRight
                    className={cn(
                      'h-3 w-3',
                      !cat.growth.startsWith('+') && 'rotate-90'
                    )}
                  />
                  {cat.growth} {t('admin:growth')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Chart Row */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Geographical Distribution */}
        <Card className="border-border/60 overflow-hidden rounded-xl shadow-sm">
          <CardHeader className="border-border/40 bg-muted/20 border-b px-6 py-4">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              <Map className="text-primary h-4 w-4" />
              {t('admin:regionalInsights')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {topRegions.map((region, idx) => (
              <div
                key={idx}
                className="bg-muted/20 border-border/40 hover:bg-muted/30 flex cursor-default items-center justify-between rounded-xl border p-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-background border-border/60 text-primary flex h-8 w-8 items-center justify-center rounded-xl border text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold tracking-tight uppercase">
                    {region.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{region.value}</p>
                  <p className="text-muted-foreground/60 text-[9px] font-bold uppercase">
                    {region.share}% {t('admin:share')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Trends Chart */}
        <Card className="border-border/60 flex min-h-[400px] flex-col overflow-hidden rounded-xl shadow-sm lg:col-span-2">
          <CardHeader className="border-border/40 bg-muted/20 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <TrendingUp className="text-primary h-4 w-4" />
                {t('admin:growthTrend')}
              </CardTitle>
              <Calendar className="text-muted-foreground/40 h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-8">
            <ActivityChart />
          </CardContent>
        </Card>
      </div>

      {/* System Health Section */}
      <div className="grid grid-cols-1">
        <Card className="border-border/60 bg-muted/30 overflow-hidden rounded-xl shadow-lg transition-colors dark:bg-slate-950 dark:text-white">
          <CardHeader className="border-border/40 bg-muted/50 border-b px-6 py-4 dark:border-white/5 dark:bg-white/5">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase dark:text-white/40">
              <Zap className="text-success h-4 w-4" />
              {t('admin:platformHealth')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase dark:text-white/30">
                    {t('admin:apiLatency')}
                  </span>
                  <span className="text-3xl font-bold">24ms</span>
                </div>
                <div className="bg-muted border-border/20 h-1.5 w-full overflow-hidden rounded-full border dark:border-white/5 dark:bg-white/5">
                  <div className="h-full w-[85%] bg-emerald-500" />
                </div>
                <p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                  {t('admin:optimized')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase dark:text-white/30">
                    {t('admin:serverLoad')}
                  </span>
                  <span className="text-3xl font-bold">12.4%</span>
                </div>
                <div className="bg-muted border-border/20 h-1.5 w-full overflow-hidden rounded-full border dark:border-white/5 dark:bg-white/5">
                  <div className="h-full w-[12%] bg-blue-500" />
                </div>
                <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase dark:text-blue-400">
                  {t('admin:stable')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase dark:text-white/30">
                    {t('admin:errorRate')}
                  </span>
                  <span className="text-3xl font-bold">0.02%</span>
                </div>
                <div className="bg-muted border-border/20 h-1.5 w-full overflow-hidden rounded-full border dark:border-white/5 dark:bg-white/5">
                  <div className="h-full w-[2%] bg-emerald-500" />
                </div>
                <p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase dark:text-emerald-400">
                  {t('admin:normal')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
