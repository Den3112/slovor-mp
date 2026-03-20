'use client'

import { CreditCard, Plus, ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import Link from 'next/link'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

import { Transaction } from '@/lib/types/database'

interface WalletWidgetProps {
  balance: number
  currency: string
  history?: { date: string; value: number }[]
  transactions?: Transaction[]
}

// Mock data generator if no history provided
const generateMockHistory = (
  baseValue: number,
  t: (key: string, options?: any) => string
) => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: `${t('common:day')} ${i + 1}`,
    value: baseValue * (0.8 + Math.random() * 0.4),
  }))
}

export function WalletWidget({
  balance,
  currency,
  history,
  transactions,
}: WalletWidgetProps) {
  const { t, locale } = useTranslation(['dashboard', 'profile'])
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use history from props, or generate from transactions, or fallback to mock
  const chartData =
    history ||
    (transactions && transactions.length > 0
      ? transactions.map((t, i) => ({ date: i.toString(), value: t.amount }))
      : generateMockHistory(balance, t))

  return (
    <HubWidget
      title={t('profile:wallet')}
      icon={CreditCard}
      colSpan={4}
      rowSpan={2}
      noPadding
      action={{
        label: t('dashboard:walletDetails.addFunds'),
        icon: Plus,
        onClick: () => router.push(`/${locale}/dashboard/wallet`),
      }}
      className="glass-panel border-primary/10 bg-background/20 shadow-primary/5 hover:border-primary/30 shadow-2xl transition-all duration-500"
    >
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="space-y-2">
          <p className="text-primary/40 text-[10px] font-black tracking-[0.2em] uppercase">
            {t('dashboard:walletDetails.availableBalance')}
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="font-heading text-foreground text-4xl font-black tracking-tighter tabular-nums">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="-mx-2 mt-6 h-[70px] w-full opacity-60">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border-primary/5 mt-6 flex items-center justify-between border-t pt-5">
          <div className="text-primary/40 text-[9px] font-black tracking-[0.2em] uppercase">
            {t('dashboard:walletDetails.defaultMethod')}
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/5 hover:text-primary h-10 w-10 rounded-2xl p-0 transition-all active:scale-90"
            aria-label={t('profile:wallet')}
          >
            <Link href={`/${locale}/dashboard/wallet`}>
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Background Decor */}
      <div className="pointer-events-none absolute top-4 right-4 z-0 p-8 opacity-5">
        <CreditCard size={140} strokeWidth={1} />
      </div>
    </HubWidget>
  )
}
