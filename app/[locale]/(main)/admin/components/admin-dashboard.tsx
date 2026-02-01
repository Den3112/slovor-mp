'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi, type AdminStats } from '@/lib/api'
import {
  Users,
  Package,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatting'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ActivityChart } from './activity-chart'

interface AdminDashboardProps {
  userEmail: string
}

export function AdminDashboard({ userEmail }: AdminDashboardProps) {
  const { t } = useTranslation('common')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true)
      const { data } = await adminApi.getDashboardStats()
      if (data) setStats(data)
      setIsLoading(false)
    }
    loadStats()
  }, [])

  const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    orange: 'bg-orange-500/10 text-orange-500'
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: t('admin.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      trend: `+12% ${t('admin.thisMonth')}`
    },
    {
      title: t('admin.activeListings'),
      value: stats.activeListings,
      icon: Package,
      color: 'emerald',
      trend: `+5% ${t('admin.thisMonth')}`
    },
    {
      title: t('admin.totalRevenue'),
      value: formatPrice(stats.totalRevenue),
      icon: CreditCard,
      color: 'amber',
      trend: `+8% ${t('admin.thisMonth')}`
    },
    {
      title: t('admin.pendingReview'),
      value: stats.pendingModeration,
      icon: Clock,
      color: 'orange',
      trend: t('admin.needsAttention')
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight italic">{t('admin.overview')}</h1>
        <p className="text-muted-foreground font-medium flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          {t('admin.systemsOperational')}. {t('admin.loggedInAs')} <span className="text-foreground font-bold">{userEmail}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-card/50 border border-border/50 rounded-3xl p-6 shadow-xl shadow-black/5 hover:bg-card transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-2xl transition-transform group-hover:scale-110",
                colorStyles[card.color as keyof typeof colorStyles]
              )}>
                <card.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-3xl font-black tracking-tight">{card.value}</h3>
              <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {card.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Chart Area */}
        <div className="lg:col-span-8 bg-card/50 border border-border/50 rounded-5xl p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('admin.activityMetrics')}
            </h3>
            <div className="flex gap-2">
              <span className="bg-muted px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.days7')}</span>
              <span className="bg-primary/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">{t('admin.days30')}</span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ActivityChart />
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/50 border border-border/50 rounded-5xl p-8">
            <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              {t('admin.actionCenter')}
            </h3>

            <div className="space-y-4">
              <Link href="/admin/listings" className="block">
                <div className="flex items-center justify-between p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl group cursor-pointer hover:bg-orange-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                      {stats.pendingModeration}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">{t('admin.pendingReview')}</p>
                      <p className="text-sm font-bold">{t('admin.listingsAwaitingApproval')}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link href="/admin/reports" className="block">
                <div className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl group cursor-pointer hover:bg-blue-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                      {stats.recentReports}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">{t('admin.openReports')}</p>
                      <p className="text-sm font-bold">{t('admin.userComplaintsPending')}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-primary rounded-5xl p-8 text-primary-foreground relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-32 w-32" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-2 relative z-10">{t('admin.proSecurity')}</h3>
            <p className="text-sm font-medium opacity-80 mb-6 relative z-10">{t('admin.securityAuditDesc')}</p>
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all relative z-10">
              {t('admin.runAudit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
