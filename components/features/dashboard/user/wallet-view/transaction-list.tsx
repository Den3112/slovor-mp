import {
  ArrowDownLeft,
  TrendingUp,
  Zap,
  Star,
  CreditCard,
  History,
  Calendar,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TransactionListProps } from './types'
import type { Transaction } from '@/lib/types/database'

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'refill':
      return {
        icon: ArrowDownLeft,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      }
    case 'promotion_top':
      return {
        icon: TrendingUp,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
      }
    case 'promotion_highlight':
      return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' }
    case 'subscription':
      return { icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
    default:
      return { icon: CreditCard, color: 'text-zinc-500', bg: 'bg-zinc-500/10' }
  }
}

export function TransactionList({
  transactions,
  onAddFunds,
}: TransactionListProps) {
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
          <History className="h-4 w-4" />
          {t('dashboard:wallet.transactions')}
        </h3>
      </div>

      {transactions.length > 0 ? (
        <div className="bg-card border-border/50 divide-border/30 divide-y overflow-hidden rounded-2xl border shadow-sm">
          {transactions.map((transaction) => {
            const info = getTransactionIcon(transaction.type)
            return (
              <div
                key={transaction.id}
                className="group hover:bg-muted/30 flex items-center gap-5 p-5 transition-colors"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 shadow-sm',
                    info.bg,
                    info.color,
                    'border-transparent'
                  )}
                >
                  <info.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-foreground text-sm font-bold tracking-tight uppercase">
                    {t(`dashboard:walletDetails.${transaction.type}`)}
                  </p>
                  <div className="text-muted-foreground/60 flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {isMounted ? new Date(transaction.created_at).toLocaleDateString() : '...'}
                    </span>
                    {transaction.id && (
                      <span className="hidden opacity-50 sm:inline">
                        #{transaction.id.slice(0, 8)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-lg font-bold tracking-tight tabular-nums',
                      transaction.type === 'refill'
                        ? 'text-emerald-500'
                        : 'text-foreground'
                    )}
                  >
                    {transaction.type === 'refill' ? '+' : '-'}
                    {formatPrice(transaction.amount, transaction.currency)}
                  </p>
                  <span
                    className={cn(
                      'inline-block rounded-md px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase mt-1',
                      transaction.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
                        : transaction.status === 'failed'
                          ? 'bg-destructive/10 text-destructive ring-1 ring-destructive/20'
                          : 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20'
                    )}
                  >
                    {t(`dashboard:orderStatuses.${transaction.status}`)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border-border/50 bg-card/30 flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-sm">
          <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <CreditCard className="text-muted-foreground/40 h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-1 text-lg font-bold">
            {t('dashboard:noOrders')}
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            {t('dashboard:walletDetails.addCreditsDescription')}
          </p>
          <Button
            onClick={onAddFunds}
            variant="outline"
            className="hover:text-primary hover:border-primary/20 rounded-lg text-[10px] font-bold tracking-widest uppercase"
          >
            {t('dashboard:walletDetails.addFunds')}
          </Button>
        </div>
      )}
    </div>
  )
}
