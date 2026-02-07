import { Plus, CreditCard, Zap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { RefillModalProps } from './types'

export function RefillModal({
  isOpen,
  onClose,
  refillAmount,
  setRefillAmount,
  selectedMethod,
  setSelectedMethod,
  onConfirm,
  isRefilling,
}: RefillModalProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border-border w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
      >
        <div className="space-y-8 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                {t('dashboard:walletDetails.refillBalance')}
              </h2>
              <p className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('dashboard:walletDetails.addCreditsDescription')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-muted hover:bg-muted/80 border-border/40 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
            >
              <Plus className="h-4 w-4 rotate-45" />
            </button>
          </div>

          <div className="space-y-4">
            <label className="text-muted-foreground/60 ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('dashboard:walletDetails.amount')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['20', '50', '100', '200', '500'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setRefillAmount(amt)}
                  className={cn(
                    'rounded-xl border-2 py-3 text-sm font-bold transition-all',
                    refillAmount === amt
                      ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-md'
                      : 'bg-muted/40 text-foreground hover:border-border/40 border-transparent'
                  )}
                >
                  €{amt}
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  placeholder={t('dashboard:walletDetails.other')}
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(e.target.value)}
                  className="bg-muted/40 focus:border-primary/50 w-full rounded-xl border-2 border-transparent py-3 pl-6 text-center text-sm font-bold outline-none"
                />
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold">
                  €
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-muted-foreground/60 ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('dashboard:walletDetails.selectMethod')}
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'card',
                  label: t('dashboard:walletDetails.card'),
                  icon: CreditCard,
                },
                {
                  id: 'apple',
                  label: t('dashboard:walletDetails.applePay'),
                  icon: Zap,
                },
                {
                  id: 'google',
                  label: t('dashboard:walletDetails.googlePay'),
                  icon: Zap,
                },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id as any)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border-2 p-3 transition-all',
                    selectedMethod === method.id
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'bg-muted/40 text-muted-foreground hover:border-border/40 border-transparent'
                  )}
                >
                  <method.icon className="h-4 w-4" />
                  <span className="flex-1 text-left text-xs font-bold">
                    {method.label}
                  </span>
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border',
                      selectedMethod === method.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                    )}
                  >
                    {selectedMethod === method.id && (
                      <Zap className="h-2 w-2 fill-current text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-border/40 flex gap-3 border-t pt-4">
            <button
              className="bg-primary shadow-primary/20 hover:bg-primary/90 text-primary-foreground h-14 flex-1 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              onClick={onConfirm}
              disabled={isRefilling || !refillAmount}
            >
              {isRefilling ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('dashboard:wallet.processing')}
                </div>
              ) : (
                `${t('dashboard:walletDetails.confirmPayment')} €${refillAmount}`
              )}
            </button>
          </div>

          <p className="text-muted-foreground/40 text-center text-[9px] font-bold tracking-widest uppercase">
            {t('dashboard:wallet.securePayment')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
