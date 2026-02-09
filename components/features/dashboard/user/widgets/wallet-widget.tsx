'use client'

import { CreditCard, Plus, ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import Link from 'next/link'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface WalletWidgetProps {
  balance: number
  currency: string
  history?: { date: string; value: number }[]
}

// Mock data generator if no history provided
const generateMockHistory = (baseValue: number) => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: baseValue * (0.8 + Math.random() * 0.4),
  }))
}

export function WalletWidget({
  balance,
  currency,
  history,
}: WalletWidgetProps) {
  const { t, locale } = useTranslation(['dashboard', 'profile'])
  const router = useRouter()
  const chartData = history || generateMockHistory(balance)

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
      className="bg-card text-card-foreground border-border"
    >
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="space-y-1">
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            {t('dashboard:walletDetails.availableBalance')}
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold tracking-tighter tabular-nums">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="-mx-2 mt-4 h-[60px] w-full opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
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
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="border-border/40 mt-4 flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            **** 4242
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/5 hover:text-primary h-8 w-8 rounded-full p-0"
          >
            <Link href={`/${locale}/dashboard/wallet`}>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Background Decor */}
      <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-5">
        <CreditCard size={120} />
      </div>
    </HubWidget>
  )
}
