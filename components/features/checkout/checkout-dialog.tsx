'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle2, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ordersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase/client'
import type { Listing } from '@/lib/types/database'
import { formatPrice } from '@/lib/utils/formatting'
import Image from 'next/image'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'

interface CheckoutDialogProps {
    listing: Listing
    isOpen: boolean
    onClose: () => void
}

export function CheckoutDialog({ listing, isOpen, onClose }: CheckoutDialogProps) {
    const { t } = useTranslation(['listing', 'common'])
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
                router.push(`/dashboard/orders/${orderId}`)
                onClose()
            }, 2000)
        } catch (err: any) {
            console.error('Purchase failed:', err)
            setError(err.message || 'An unexpected error occurred during purchase.')
            toast.error(err.message || 'Purchase failed')
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
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
                                <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/10 relative">
                                    {listing.images?.[0] && (
                                        <Image
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{listing.title}</h4>
                                    <p className="font-heading text-lg font-black tracking-tight text-primary">
                                        {formatPrice(listing.price, listing.currency)}
                                    </p>
                                </div>
                            </div>

                            {/* Wallet Info Badge */}
                            <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                    <Wallet className="h-3.5 w-3.5" />
                                    Payment Method
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Internal Wallet</span>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row pt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isProcessing}
                                className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 border-border/60 flex-1"
                            >
                                {t('common:back')}
                            </Button>
                            <Button
                                onClick={handlePurchase}
                                disabled={isProcessing}
                                className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] h-11 shadow-lg shadow-primary/20"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    t('listing:confirmPurchase')
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20 animate-in zoom-in-50 duration-500">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Success!</h3>
                            <p className="text-sm font-medium text-muted-foreground max-w-[280px]">
                                {t('listing:purchaseSuccess')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">
                            Redirecting to order details...
                        </div>
                    </div>
                )}
            </div>
        </ResponsiveDialog>
    )
}
