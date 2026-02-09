'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { ActivityChart } from '../activity-chart'
import { LiveMonitor } from '../vantage/live-monitor'
import { ActionStream } from '../vantage/action-stream'
import { PriorityQueueTile } from '../priority-queue-tile'
import { AdminHero } from '../admin-hero'
import { RevenueWidget, ContentOverviewWidget } from '../widgets'
import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { PremiumBackground } from '@/components/ui/premium-background'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function AdminOverviewView({ userEmail }: { userEmail: string }) {
  const { t } = useTranslation(['common', 'admin'])
  // const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for now to show Skeleton/Loading state if needed
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  // if (!stats) return null // Removing this to allow rendering even without stats for now

  return (
    <PremiumBackground
      variant="mesh"
      className="min-h-screen border-none p-4 md:p-8"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-8"
        data-testid="admin-overview-view"
      >
        <BentoGrid>
          {/* Admin Hero - Command Vitals */}
          <BentoTile
            colSpan={12}
            rowSpan={2}
            className="border-blue-500/20 bg-blue-500/5"
          >
            <AdminHero userEmail={userEmail} />
          </BentoTile>

          {/* Revenue & Critical Monitor */}
          <RevenueWidget />

          <BentoTile
            colSpan={12}
            rowSpan={3} // Taller for queue
            className="border-rose-500/20 bg-rose-500/5 lg:col-span-4"
          >
            <PriorityQueueTile />
          </BentoTile>

          <ContentOverviewWidget />

          {/* Activity Dynamics */}
          <BentoTile colSpan={12} rowSpan={3} className="lg:col-span-8">
            <div className="flex h-full flex-col p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <BarChart3 className="text-primary h-4 w-4" />
                    {t('admin:activityMetrics')}
                  </h3>
                </div>
              </div>
              <div className="flex-1">
                {/* Fallback to internal mock data as AdminStats doesn't have time-series yet */}
                <ActivityChart />
              </div>
            </div>
          </BentoTile>

          {/* Live Monitor & Action Stream */}
          <BentoTile
            colSpan={12}
            rowSpan={3}
            className="border-indigo-500/10 bg-indigo-500/5 p-0 lg:col-span-4"
          >
            <LiveMonitor />
          </BentoTile>

          <BentoTile
            colSpan={12}
            rowSpan={3}
            className="border-primary/10 bg-primary/5 p-0 lg:col-span-4"
          >
            <ActionStream />
          </BentoTile>
        </BentoGrid>
      </motion.div>
    </PremiumBackground>
  )
}
