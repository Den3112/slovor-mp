'use client'

import { CreditCard, Plus, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import Link from 'next/link'

interface WalletCardProps {
  balance: number
  currency: string
  onAddFunds?: () => void
}

export function WalletCard({ balance, currency, onAddFunds }: WalletCardProps) {
  const { t, locale } = useTranslation()

  return (
    <Card className="border-border/80 group relative overflow-hidden rounded-lg bg-slate-950 text-white shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10 md:p-8">
        <CreditCard size={120} />
      </div>

      <CardContent className="relative z-10 flex h-full min-h-[200px] flex-col justify-between p-6 md:min-h-[220px] md:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-white/5 bg-slate-900 p-2">
              <CreditCard className="text-primary h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Slovor Wallet
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {t('dashboard:walletDetails.availableBalance')}
            </p>
            <h2 className="text-4xl font-bold tracking-tighter">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button
            size="sm"
            onClick={onAddFunds}
            className="h-10 flex-1 rounded-lg bg-white px-4 text-[10px] font-bold tracking-widest text-slate-950 uppercase hover:bg-white/90"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            {t('dashboard:walletDetails.addFunds')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="h-10 rounded-lg border-white/10 bg-slate-900 px-4 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-slate-800"
          >
            <Link href={`/${locale}/dashboard/wallet`}>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
