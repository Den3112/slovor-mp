'use client'

import { Zap, TrendingUp, Users, Target } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { PremiumBackground } from '@/components/ui/premium-background'
import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { cn } from '@/lib/utils'

export function MarketInsightsView() {
  const { t } = useTranslation(['dashboard', 'common'])

  const stats = [
    {
      icon: TrendingUp,
      title: t('dashboard:totalViews'),
      value: '1.2k',
      trend: '+12%',
      color: 'text-emerald-500',
    },
    {
      icon: Users,
      title: t('dashboard:successScore'),
      value: '98/100',
      trend: '+2%',
      color: 'text-blue-500',
    },
    {
      icon: Target,
      title: t('dashboard:topPercentile').replace('{{percentile}}', '5'),
      value: 'Top 5%',
      color: 'text-purple-500',
    },
    {
      icon: Zap,
      title: t('dashboard:reachProLevel'),
      value: 'Active',
      color: 'text-primary',
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <PremiumBackground variant="mesh" />

      <div className="relative z-10 px-6">
        <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
          <Zap className="text-primary h-8 w-8" />
          {t('dashboard:marketInsights')}
        </h1>
        <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('dashboard:personalizedRecommendations')}
        </p>
      </div>

      <BentoGrid className="px-6">
        {stats.map((stat, idx) => (
          <BentoTile key={idx} colSpan={3} delay={idx * 0.1}>
            <div className="flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'bg-card/50 border-border/10 flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm',
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.trend && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-70">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </div>
          </BentoTile>
        ))}

        <BentoTile
          colSpan={12}
          className="relative min-h-[400px] overflow-hidden"
        >
          <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-50" />
          <div className="relative z-10 flex h-full items-center justify-center p-8">
            <div className="max-w-2xl space-y-6 text-center">
              <div className="bg-primary/10 border-primary/20 mx-auto flex h-20 w-20 items-center justify-center rounded-xl border shadow-md">
                <Zap className="text-primary h-10 w-10 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">
                  {t('dashboard:smartNudges')}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('dashboard:performanceGood')}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
                <div className="bg-card border-border rounded-xl border p-4">
                  <p className="text-primary text-xl font-bold">2.4x</p>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Faster Sales
                  </p>
                </div>
                <div className="bg-card border-border rounded-xl border p-4">
                  <p className="text-xl font-bold text-blue-500">+12%</p>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Growth
                  </p>
                </div>
                <div className="bg-card border-border rounded-xl border p-4">
                  <p className="text-xl font-bold text-purple-500">98%</p>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Score
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BentoTile>
      </BentoGrid>
    </div>
  )
}
