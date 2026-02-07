'use client'

import { Phone, MessageCircle, Loader2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface ListingActionButtonsProps {
  seller: NonNullable<Listing['user']>
  isContacting: boolean
  showPhone: boolean
  onContact: () => void
  onCall: () => void
  onBuy?: () => void
  className?: string
}

export function ListingActionButtons({
  seller,
  isContacting,
  showPhone,
  onContact,
  onCall,
  onBuy,
  className,
}: ListingActionButtonsProps) {
  const { t } = useTranslation(['listing', 'common'])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Prime Action: Buy Now (if available) */}
      {onBuy && (
        <Button
          size="lg"
          data-action="buy"
          className="bg-primary text-primary-foreground shadow-primary/20 h-16 w-full rounded-lg text-lg font-bold tracking-widest uppercase shadow-xl transition-all active:scale-[0.98]"
          onClick={onBuy}
        >
          <ShoppingCart className="mr-2 h-6 w-6" />
          {t('listing:buyNow')}
        </Button>
      )}

      {/* Secondary Action: Chat/Message */}
      <Button
        variant={onBuy ? 'outline' : 'default'}
        size="lg"
        data-action="contact"
        className={cn(
          'h-16 w-full rounded-lg text-lg font-bold tracking-widest uppercase transition-all active:scale-[0.98]',
          onBuy
            ? 'border-border/60 hover:bg-muted/40'
            : 'bg-primary text-primary-foreground shadow-primary/20 shadow-xl'
        )}
        onClick={onContact}
        disabled={isContacting}
      >
        {isContacting ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <MessageCircle className="mr-2 h-6 w-6" />
        )}
        {t('listing:contactSeller')}
      </Button>

      {/* Tertiary Action: Call/Phone */}
      {!showPhone ? (
        <Button
          variant="outline"
          size="lg"
          data-action="call"
          className="hover:border-primary/30 border-border bg-muted/40 hover:bg-muted/60 h-16 w-full gap-3 rounded-lg font-bold tracking-widest uppercase transition-all"
          onClick={onCall}
        >
          <Phone className="text-primary h-5 w-5" />
          {t('listing:callNow')}
        </Button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300">
          <a
            href={`tel:${seller.phone}`}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-lg border-2 border-emerald-500/20 bg-emerald-500/10 text-xl font-bold text-emerald-600 transition-all hover:bg-emerald-500/20 md:text-2xl"
          >
            <Phone className="h-6 w-6 animate-pulse" />
            {seller.phone}
          </a>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground w-full text-xs font-bold tracking-widest uppercase hover:bg-emerald-500/5"
            onClick={() =>
              window.open(
                `https://wa.me/${seller.phone?.replace(/\D/g, '')}`,
                '_blank'
              )
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('listing:whatsapp')}
          </Button>
          <p className="text-muted-foreground mt-2 text-center text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('listing:callRecommendation')}
          </p>
        </div>
      )}
    </div>
  )
}
