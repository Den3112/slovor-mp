'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle2, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
import { ordersApi } from '@/shared/lib/api'
import { supabase } from '@/shared/lib/supabase/client'
import type { Listing } from '@/shared/lib/types/database'
import { formatPrice } from '@/shared/lib/utils/formatting'
import Image from 'next/image'
import { ResponsiveDialog } from '@/shared/ui/responsive-dialog'

interface CheckoutDialogProps {
  listing: Listing
  isOpen: boolean
  onClose: () => void
}

export function CheckoutDialog({
  listing,
  isOpen,
  onClose,
}: CheckoutDialogProps) {
  const { t, locale } = useTranslation(['listing', 'common'])
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const { data: orderId, error: purchaseError } = await ordersApi.purchase(
        supabase,
        listing.id,
        listing.price
      )

      if (purchaseError) throw new Error(purchaseError.message)

      setIsSuccess(true)
      toast.success(t('listing:purchaseSuccess'))

      // Redirect to order details after a short delay
      setTimeout(() => {
        router.push(`/${locale}/dashboard/orders/${orderId}`)
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Purchase failed:', err)
      const errorMsg =
        err instanceof Error ? err.message : t('listing:unexpectedError')
      setError(errorMsg)
      toast.error(t('listing:purchaseFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={(val) => !val && onClose()}
      title={t('listing:purchaseTitle')}
      description={t('listing:purchaseDescription')}
    >
      <div className="space-y-6">
        {!isSuccess ? (
          <>
            <div className="space-y-6">
              {/* Listing Summary Card */}
              <div className="bg-muted/30 border-border/40 flex items-center gap-4 rounded-xl border p-4">
                <div className="bg-muted border-border/10 relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border">
                  {listing.images?.[0] && (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold">
                    {listing.title}
                  </h4>
                  <p className="font-heading text-primary text-lg font-bold tracking-tight">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                </div>
              </div>

              {/* Wallet Info Badge */}
              <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-xl border p-3">
                <div className="text-primary flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  <Wallet className="h-3.5 w-3.5" />
                  {t('listing:paymentMethod')}
                </div>
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                  {t('listing:internalWallet')}
                </span>
              </div>

              {error && (
                <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border p-4">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-xs leading-relaxed font-bold">{error}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="border-border/60 h-11 flex-1 rounded-xl text-[10px] font-bold tracking-widest uppercase"
              >
                {t('common:back')}
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="shadow-primary/20 h-11 flex-1 rounded-xl text-[10px] font-bold tracking-widest uppercase shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('listing:processing')}
                  </>
                ) : (
                  t('listing:confirmPurchase')
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
            <div className="animate-in zoom-in-50 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 duration-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight uppercase">
                {t('listing:checkoutSuccess')}
              </h3>
              <p className="text-muted-foreground max-w-[280px] text-sm font-medium">
                {t('listing:purchaseSuccess')}
              </p>
            </div>
            <div className="text-muted-foreground/40 flex animate-pulse items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              {t('listing:redirectingToOrder')}
            </div>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  )
}
