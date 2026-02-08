import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import { WalletHeaderProps } from './types'

export function WalletHeader({
  balance,
  currency,
  onAddFunds,
}: WalletHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="border-border relative overflow-hidden rounded-lg border bg-slate-950 p-8 text-white shadow-sm md:p-12">
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            {t('dashboard:walletDetails.title')} {t('common:balance')}
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-bold tracking-tighter md:text-6xl">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onAddFunds}
            className="bg-primary hover:bg-primary/90 flex h-12 items-center gap-3 rounded-lg px-6 text-[10px] font-bold tracking-[0.2em] uppercase shadow-none transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t('dashboard:walletDetails.addFunds')}
          </Button>
        </div>
      </div>
    </div>
  )
}
