import { CreditCard, ShoppingBag, Zap, History } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import { WalletStatsProps } from './types'

export function WalletStats({ transactions, currency }: WalletStatsProps) {
  const { t } = useTranslation()

  const stats = [
    {
      label: t('dashboard:wallet.spending'),
      value: formatPrice(
        transactions
          .filter((t) => t.type !== 'refill')
          .reduce((s, t) => s + t.amount, 0),
        currency
      ),
      icon: CreditCard,
    },
    {
      label: t('dashboard:wallet.revenue'),
      value: formatPrice(0, currency),
      icon: ShoppingBag,
    },
    {
      label: t('dashboard:wallet.activePromos'),
      value: transactions.filter(
        (t) =>
          (t.type === 'promotion_top' || t.type === 'promotion_highlight') &&
          t.status === 'completed'
      ).length,
      icon: Zap,
    },
    {
      label: t('dashboard:wallet.transactions'),
      value: transactions.length,
      icon: History,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-primary/5 hover:scale-[1.02] group relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-300"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10 transition-colors group-hover:bg-primary/10">
            <stat.icon className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
          </div>
          <p className="text-muted-foreground/60 mb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {stat.label}
          </p>
          <p className="text-foreground text-2xl font-bold tracking-tight">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
