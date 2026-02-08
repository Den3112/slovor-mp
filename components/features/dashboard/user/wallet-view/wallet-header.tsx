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
    <div className="bg-linear-to-br from-primary/90 to-primary text-primary-foreground relative overflow-hidden rounded-2xl border p-8 shadow-lg md:p-10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="text-primary-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:walletDetails.title')} {t('common:balance')}
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-bold tracking-tighter md:text-7xl">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onAddFunds}
            className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 flex h-12 items-center gap-2.5 rounded-xl border px-6 text-[10px] font-bold tracking-[0.2em] uppercase shadow-none transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t('dashboard:walletDetails.addFunds')}
          </Button>
        </div>
      </div>
    </div>
  )
}
