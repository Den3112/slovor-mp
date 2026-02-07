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
          className="border-border/60 bg-card rounded-lg border p-5 shadow-sm"
        >
          <stat.icon className="text-muted-foreground/60 mb-3 h-5 w-5" />
          <p className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
            {stat.label}
          </p>
          <p className="text-foreground text-xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
