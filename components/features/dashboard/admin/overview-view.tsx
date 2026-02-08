'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Package,
  Clock,
  Loader2,
  CreditCard,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { adminApi, type AdminStats } from '@/lib/api'
import { formatPrice } from '@/lib/utils/formatting'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'

import { Button } from '@/components/ui/button'

import { ActivityChart } from './activity-chart'
import { LiveMonitor } from './live-monitor'
import { AlertCircle, ShieldCheck, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

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

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <PremiumBackground variant="mesh" className="min-h-screen border-none p-4 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-8"
        data-testid="admin-overview-view"
      >
        <BentoGrid>
          {/* Admin Hero & Command Vitals */}
          <BentoTile colSpan={12} rowSpan={2} className="border-blue-500/20 bg-blue-500/5">
            <AdminHero userEmail={userEmail} />
          </BentoTile>

          {/* Core Stats Row */}
          <BentoTile colSpan={3} className="bg-background/20">
            <StatsCard
              label={t('admin:totalUsers')}
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              trend={{ value: 12, direction: 'up', label: t('admin:vsLastMonth') }}
            />
          </BentoTile>
          <BentoTile colSpan={3} className="bg-background/20">
            <StatsCard
              label={t('admin:activeListings')}
              value={stats.activeListings.toLocaleString()}
              icon={Package}
              trend={{ value: 8, direction: 'up', label: t('admin:vsLastMonth') }}
            />
          </BentoTile>
          <BentoTile colSpan={3} className="bg-background/20">
            <StatsCard
              label={t('admin:revenue')}
              value={formatPrice(stats.totalRevenue)}
              icon={CreditCard}
              trend={{ value: 5, direction: 'down', label: t('admin:vsLastMonth') }}
            />
          </BentoTile>
          <BentoTile colSpan={3} className={cn(
            "bg-card/40 dark:bg-background/20",
            stats.pendingModeration > 0 && "border-amber-500/50 bg-amber-500/5"
          )}>
            <StatsCard
              label={t('admin:pendingModeration')}
              value={stats.pendingModeration.toLocaleString()}
              icon={Clock}
              trend={{
                value: stats.pendingModeration > 0 ? 15 : 0,
                direction: 'neutral',
                label: t('admin:currentBacklog'),
              }}
            />
          </BentoTile>

          {/* Activity Chart - Command Insight */}
          <BentoTile colSpan={8} rowSpan={3} className="bg-card/40 dark:bg-slate-900/40">
            <div className="flex h-full flex-col p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <BarChart3 className="text-primary h-4 w-4" />
                    {t('admin:activityMetrics')}
                  </h3>
                </div>
                <div className="bg-muted/10 flex rounded-lg p-1">
                  <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest">{t('admin:days7')}</Button>
                  <Button variant="secondary" size="sm" className="h-7 border border-border/40 text-[9px] font-bold uppercase tracking-widest">{t('admin:days30')}</Button>
                </div>
              </div>
              <div className="flex-1">
                <ActivityChart />
              </div>
            </div>
          </BentoTile>

          {/* Real-time Event Monitor */}
          <BentoTile colSpan={4} rowSpan={3} className="border-indigo-500/20 bg-indigo-500/5 p-6">
            <LiveMonitor />
          </BentoTile>

          {/* Quick Management Tools */}
          <BentoTile colSpan={12} className="border-none bg-transparent shadow-none backdrop-blur-none">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { href: 'listings', label: t('admin:listings'), icon: Package, count: stats.activeListings },
                { href: 'reports', label: t('admin:reportsTitle'), icon: AlertCircle, count: stats.pendingModeration, color: 'text-destructive' },
                { href: 'users', label: t('admin:usersOverview'), icon: Users },
                { href: 'content', label: t('admin:content'), icon: Layers },
                { href: 'verifications', label: t('admin:verifications'), icon: ShieldCheck },
                { href: 'analytics', label: t('admin:analytics'), icon: BarChart3 }
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}/admin/${tool.href}`}
                  className="bg-card/40 border-border/40 hover:border-primary/40 dark:bg-card/20 group flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02]"
                >
                  <tool.icon className={cn("h-5 w-5 mb-1", tool.color || "text-primary")} />
                  <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">{tool.label}</span>
                </Link>
              ))}
            </div>
          </BentoTile>
        </BentoGrid>
      </motion.div>
    </PremiumBackground>
  )
}

import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { PremiumBackground } from '@/components/ui/premium-background'
import { AdminHero } from './admin-hero'
