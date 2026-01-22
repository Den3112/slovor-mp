import { Button } from '@/components/ui/button'
import { MessageCircle, Phone, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { User } from '@/lib/types/database'

interface ListingActionButtonsProps {
    seller: User | undefined
    isContacting: boolean
    showPhone: boolean
    onContact: () => void
    onCall: () => void
}

export function ListingActionButtons({
    seller,
    isContacting,
    showPhone,
    onContact,
    onCall
}: ListingActionButtonsProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-3 pt-4">
            <Button
                size="lg"
                className="h-20 w-full rounded-none font-sans text-[10px] font-black uppercase tracking-[0.3em] shadow-[10px_10px_0px_0px_rgba(175,27,27,0.2)] transition-all hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_rgba(175,27,27,0.4)] active:translate-y-0"
                onClick={onContact}
                disabled={isContacting}
            >
                {isContacting ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                    <MessageCircle className="mr-3 h-5 w-5" />
                )}
                {t.listing.contactSeller}
            </Button>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    size="lg"
                    className="h-16 gap-3 rounded-none border-2 border-primary/20 font-sans text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/5 hover:border-primary"
                    onClick={onCall}
                >
                    <Phone className="h-4 w-4" />
                    {showPhone ? seller?.phone || t.listing.call : t.listing.call}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="h-16 gap-3 rounded-none border-2 border-primary/20 font-sans text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/5 hover:border-primary"
                    onClick={onContact}
                    disabled={isContacting}
                >
                    <MessageCircle className="h-4 w-4" />
                    {t.listing.message}
                </Button>
            </div>
        </div>
    )
}
