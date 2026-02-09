'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useTranslation } from '@/lib/i18n'
import { transactionsApi } from '@/lib/api/transactions'
import { formatPrice } from '@/lib/utils/formatting'

export function RevenueWidget() {
  const { t } = useTranslation(['admin'])
  const [stats, setStats] = useState<{
    total_revenue: number
    count: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const { data } = await transactionsApi.getAdminStats()
      if (data) setStats(data)
      setIsLoading(false)
    }
    fetchStats()
  }, [])

  // Mock Data for the chart for now, but total is real
  const data = [
    { value: 4000 },
    { value: 3000 },
    { value: 5000 },
    { value: 2780 },
    { value: 1890 },
    { value: 6390 },
    { value: 3490 },
    { value: 4000 },
    { value: 3000 },
    { value: 5000 },
    { value: 2780 },
    { value: 1890 },
    { value: 6390 },
    { value: 3490 },
  ]

  return (
    <HubWidget
      title={t('admin:revenue')}
      icon={DollarSign}
      colSpan={4}
      rowSpan={2}
      noPadding
      className="border-emerald-500/20 bg-emerald-950/20"
      action={{
        label: t('admin:fullSystemReport'),
        icon: ArrowUpRight,
        onClick: () => {},
      }}
    >
      <div className="relative flex h-full flex-col justify-between overflow-hidden p-6">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            ) : (
              <h2 className="text-foreground text-4xl font-bold tracking-tighter tabular-nums">
                {formatPrice(stats?.total_revenue || 0, 'EUR')}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold">+{stats?.count || 0}</span>
            <span className="text-muted-foreground text-xs tracking-wider uppercase">
              {t('admin:marketplaceTransactions')}
            </span>
          </div>
        </div>

        <div className="-mx-6 mt-auto -mb-6 h-[100px] w-full opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </HubWidget>
  )
}
