'use client'

import { Phone, MessageCircle, Loader2 } from 'lucide-react'
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
  className?: string
}

export function ListingActionButtons({
  seller,
  isContacting,
  showPhone,
  onContact,
  onCall,
  className,
}: ListingActionButtonsProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('space-y-4', className)}>
      {/* Primary Action: Chat/Message */}
      <Button
        size="lg"
        className="shadow-primary/20 bg-primary text-primary-foreground h-16 w-full rounded-2xl text-lg font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        onClick={onContact}
        disabled={isContacting}
      >
        {isContacting ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <MessageCircle className="mr-2 h-6 w-6" />
        )}
        {t('listing.contactSeller')}
      </Button>

      {/* Secondary Action: Call/Phone */}
      {!showPhone ? (
        <Button
          variant="outline"
          size="lg"
          className="hover:border-primary/30 h-16 w-full gap-3 rounded-2xl border-white/10 bg-white/5 font-black transition-all hover:bg-white/10"
          onClick={onCall}
        >
          <Phone className="text-primary h-5 w-5" />
          {t('listing.callNow')}
        </Button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300">
          <a
            href={`tel:${seller.phone}`}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/10 text-xl font-black text-emerald-600 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500/20 md:text-2xl"
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
            {t('listing.whatsapp')}
          </Button>
          <p className="text-muted-foreground mt-2 text-center text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('listing.callRecommendation')}
          </p>
        </div>
      )}
    </div>
  )
}
