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
import { EmptyState } from '@/components/ui/empty-state'
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
        <div className="divide-border/40 border-border/60 bg-card divide-y overflow-hidden rounded-lg border shadow-sm">
          {transactions.map((transaction) => {
            const info = getTransactionIcon(transaction.type)
            return (
              <div
                key={transaction.id}
                className="group hover:bg-muted/30 flex items-center gap-5 p-6 transition-colors"
              >
                <div
                  className={cn(
                    'border-border/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105',
                    info.bg,
                    info.color
                  )}
                >
                  <info.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-foreground text-sm font-bold tracking-tight uppercase">
                    {t(`dashboard:walletDetails.${transaction.type}`)}
                  </p>
                  <div className="text-muted-foreground/60 flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {isMounted ? new Date(transaction.created_at).toLocaleDateString() : '...'}
                    </span>
                    {transaction.id && (
                      <span className="hidden sm:inline">
                        REF: #{transaction.id.slice(0, 8)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-lg font-bold tracking-tight',
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
                      'rounded border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase',
                      transaction.status === 'completed'
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500'
                        : transaction.status === 'failed'
                          ? 'border-destructive/20 bg-destructive/5 text-destructive'
                          : 'border-amber-500/20 bg-amber-500/5 text-amber-500'
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
        <EmptyState
          icon={CreditCard}
          title={t('dashboard:noOrders')}
          description={t('dashboard:walletDetails.addCreditsDescription')}
          actionLabel={t('dashboard:walletDetails.addFunds')}
          onAction={onAddFunds}
        />
      )}
    </div>
  )
}
