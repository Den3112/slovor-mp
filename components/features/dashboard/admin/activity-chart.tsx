'use client'

import { useEffect, useState } from 'react'
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart'
import { Loader2 } from 'lucide-react'
import { transactionsApi } from '@/lib/api/transactions'
import { useTranslation } from '@/lib/i18n'

interface ActivityChartProps {
  data?: any[]
}

export function ActivityChart({ data: initialData }: ActivityChartProps) {
  const { locale } = useTranslation(['admin'])
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData) {
      setData(initialData)
      return
    }

    async function fetchActivity() {
      try {
        // Fetch last 100 transactions to aggregate
        const { data: transactions } = await transactionsApi.getForUser('all')

        // Group by day for the last 7 days
        const chartData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          const dateStr = date.toISOString().split('T')[0] ?? ''

          let total = 0
          if (transactions) {
            total = transactions
              .filter(t => t.created_at.startsWith(dateStr))
              .reduce((sum, t) => sum + Number(t.amount), 0)
          }

          return {
            date: date.toLocaleDateString(locale || undefined, { weekday: 'short' }),
            value: total,
          }
        })

        setData(chartData)
      } catch (err) {
        console.error('Failed to fetch activity chart data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivity()
  }, [initialData, locale])

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[200px] w-full items-center justify-center">
        <Loader2 className="text-primary/20 h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <AnalyticsChart data={data} />
}
