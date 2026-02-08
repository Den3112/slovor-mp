'use client'

import { BarChart3, TrendingUp, Users } from 'lucide-react'

export function MarketInsightsTile() {
  const trends = [
    {
      label: 'Electronics',
      growth: '+12%',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    { label: 'Demand', growth: 'High', icon: Users, color: 'text-blue-500' },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold tracking-tight uppercase opacity-60">
            Market Insights
          </h3>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {trends.map((trend, idx) => (
          <div
            key={idx}
            className="bg-background/40 border-border/20 flex items-center justify-between rounded-xl border p-3"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <trend.icon className={`h-4 w-4 ${trend.color}`} />
              </div>
              <span className="text-sm font-medium">{trend.label}</span>
            </div>
            <span className={`text-sm font-bold ${trend.color}`}>
              {trend.growth}
            </span>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground mt-4 text-[10px] leading-relaxed italic">
        * Based on local activity in last 24h
      </p>
    </div>
  )
}
