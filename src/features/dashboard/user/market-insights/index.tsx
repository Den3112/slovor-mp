'use client'

import { Zap, TrendingUp, Users, Target } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'
import { PremiumBackground } from '@/shared/ui/premium-background'
import { BentoGrid, BentoTile } from '@/shared/ui/bento'
import { cn } from '@/shared/lib/utils'

export function MarketInsightsView() {
  const { t } = useTranslation(['dashboard', 'common'])

  const stats = [
    {
      icon: TrendingUp,
      title: t('dashboard:totalViews'),
      value: '1.2k',
      trend: '+12%',
      color: 'text-emerald-500',
      glow: 'shadow-emerald-500/10',
    },
    {
      icon: Users,
      title: t('dashboard:successScore'),
      value: '98/100',
      trend: '+2%',
      color: 'text-blue-500',
      glow: 'shadow-blue-500/10',
    },
    {
      icon: Target,
      title: t('dashboard:topPercentile').replace('{{percentile}}', '5'),
      value: 'Top 5%',
      color: 'text-purple-500',
      glow: 'shadow-purple-500/10',
    },
    {
      icon: Zap,
      title: t('dashboard:reachProLevel'),
      value: 'Active',
      color: 'text-primary',
      glow: 'shadow-primary/10',
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
      <PremiumBackground variant="mesh" />

      {/* Header */}
      <div className="relative z-10 px-6">
        <h1 className="text-foreground flex items-center gap-4 text-4xl font-black tracking-tighter uppercase">
          <div className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg">
            <Zap className="text-primary h-8 w-8" />
          </div>
          {t('dashboard:marketInsights')}
        </h1>
        <p className="text-muted-foreground mt-2 ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
          {t('dashboard:personalizedRecommendations')}
        </p>
      </div>

      <BentoGrid className="gap-6 px-6">
        {stats.map((stat, idx) => (
          <BentoTile
            key={idx}
            colSpan={3}
            delay={idx * 0.1}
            className={cn(
              'glass-panel group border-primary/5 bg-background/20 transition-all duration-500 hover:scale-[1.02]',
              stat.glow
            )}
          >
            <div className="flex h-full flex-col justify-between p-8">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'bg-primary/5 border-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6',
                    stat.color
                  )}
                >
                  <stat.icon className="h-7 w-7" />
                </div>
                {stat.trend && (
                  <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-500 uppercase shadow-sm">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="mt-8">
                <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase opacity-50">
                  {stat.title}
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-tighter tabular-nums">
                  {stat.value}
                </h3>
              </div>
            </div>
            <div className="bg-primary/5 absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60" />
          </BentoTile>
        ))}

        <BentoTile
          colSpan={12}
          className="glass-panel group border-primary/10 bg-background/20 shadow-primary/5 relative min-h-[450px] overflow-hidden rounded-[2.5rem] shadow-2xl"
        >
          <div className="from-primary/10 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-60 blur-3xl transition-opacity duration-1000 group-hover:opacity-80" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="max-w-3xl space-y-10">
              <div className="bg-primary/10 border-primary/20 shadow-primary/20 mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border shadow-2xl backdrop-blur-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                <Zap className="text-primary h-12 w-12 animate-pulse" />
              </div>

              <div className="space-y-4">
                <h2 className="text-foreground text-4xl font-black tracking-tighter uppercase sm:text-5xl">
                  {t('dashboard:smartNudges')}
                </h2>
                <p className="text-muted-foreground mx-auto max-w-xl text-lg leading-relaxed font-medium opacity-80">
                  {t('dashboard:performanceGood')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
                {[
                  {
                    value: '2.4x',
                    label: 'Faster Sales',
                    color: 'text-primary',
                    border: 'border-primary/20',
                  },
                  {
                    value: '+12%',
                    label: 'Growth',
                    color: 'text-blue-500',
                    border: 'border-blue-500/20',
                  },
                  {
                    value: '98%',
                    label: 'Success Score',
                    color: 'text-purple-500',
                    border: 'border-purple-500/20',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      'glass-panel group/item bg-background/40 hover:bg-background/60 space-y-2 rounded-2xl border p-6 transition-all duration-500 hover:scale-105',
                      item.border
                    )}
                  >
                    <p
                      className={cn(
                        'text-3xl font-black tracking-tighter',
                        item.color
                      )}
                    >
                      {item.value}
                    </p>
                    <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase opacity-60 transition-opacity group-hover/item:opacity-100">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Background Grids */}
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </BentoTile>
      </BentoGrid>
    </div>
  )
}
