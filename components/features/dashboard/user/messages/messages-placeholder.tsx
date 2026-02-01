'use client'

import { MessageSquarePlus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function MessagesPlaceholder() {
    const { t } = useTranslation(['messages', 'common'])
    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-lg shadow-primary/5">
                <MessageSquarePlus className="h-10 w-10 text-primary opacity-80" />
            </div>
            <h3 className="mb-2 text-2xl font-black tracking-tight italic text-foreground">
                {t('messages:selectConversation')}
            </h3>
            <p className="mx-auto max-w-xs text-base font-medium leading-relaxed opacity-80">
                {t('messages:negotiateDeals')}
            </p>
        </div>
    )
}
