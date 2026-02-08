'use client'

import { useEffect, useState } from 'react'
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart'
import { Loader2 } from 'lucide-react'

interface ActivityChartProps {
  data?: any[]
}

export function ActivityChart({ data: initialData }: ActivityChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData) {
      setData(initialData)
      return
    }

    // Mock data for now
    const mockData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString(undefined, { weekday: 'short' }),
        value: Math.floor(Math.random() * 100) + 20,
      }
    })

    const timer = setTimeout(() => {
      setData(mockData)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [initialData])

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[200px] w-full items-center justify-center">
        <Loader2 className="text-primary/20 h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <AnalyticsChart data={data} />
}
