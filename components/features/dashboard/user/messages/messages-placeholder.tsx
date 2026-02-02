'use client'

import { MessageSquarePlus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function MessagesPlaceholder() {
    const { t } = useTranslation(['messages', 'common'])
    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground animate-in fade-in zoom-in-95 duration-500 bg-background">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
                <MessageSquarePlus className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tight text-foreground uppercase">
                {t('messages:selectConversation')}
            </h3>
            <p className="mx-auto max-w-xs text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                {t('messages:negotiateDeals')}
            </p>
        </div>
    )
}
