'use client'

import { BarChart3, TrendingUp, Users } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function MarketInsightsTile() {
  const { t } = useTranslation(['dashboard'])

  const trends = [
    {
      label: t('dashboard:electronics'),
      growth: '+12%',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: t('dashboard:demand'),
      growth: t('dashboard:high'),
      icon: Users,
      color: 'text-blue-500',
    },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/5 rounded-xl p-2">
            <BarChart3 className="text-primary h-5 w-5" />
          </div>
          <h3 className="text-primary/40 text-[10px] font-black tracking-[0.25em] uppercase">
            {t('dashboard:marketInsights')}
          </h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {trends.map((trend, idx) => (
          <div
            key={idx}
            className="glass-panel bg-background/20 border-primary/5 flex items-center justify-between rounded-2xl border p-4 transition-all duration-500 hover:border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/5 flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-primary/10 shadow-inner">
                <trend.icon className={`h-5 w-5 ${trend.color}`} />
              </div>
              <span className="text-foreground text-xs font-black tracking-tight uppercase">
                {trend.label}
              </span>
            </div>
            <span className={`text-xs font-black ${trend.color} tracking-tighter`}>
              {trend.growth}
            </span>
          </div>
        ))}
      </div>

      <p className="text-primary/30 mt-6 text-[10px] font-medium leading-relaxed italic tracking-wide">
        {t('dashboard:marketInsightsNote')}
      </p>
    </div>
  )
}
