'use client'

import { MessageSquarePlus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function MessagesPlaceholder() {
  const { t } = useTranslation(['messages', 'common'])
  return (
    <div className="text-muted-foreground animate-in fade-in zoom-in-95 bg-background flex h-full flex-col items-center justify-center p-8 text-center duration-500">
      <div className="group relative mb-8 cursor-default">
        <div className="bg-primary/20 absolute -inset-4 rounded-full opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100" />
        <div className="from-primary/10 to-primary/5 border-primary/20 shadow-primary/5 relative flex h-24 w-24 items-center justify-center rounded-3xl border bg-linear-to-br shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
          <MessageSquarePlus className="text-primary h-10 w-10 drop-shadow-sm" />
        </div>
        <div className="bg-card border-border absolute -right-2 -bottom-2 flex h-10 w-10 animate-bounce items-center justify-center rounded-2xl border shadow-lg delay-700">
          <div className="text-xl">👋</div>
        </div>
      </div>

      <h3 className="text-foreground mb-3 text-2xl font-bold tracking-tight uppercase">
        {t('messages:selectConversation')}
      </h3>
      <p className="mx-auto max-w-xs text-xs leading-relaxed font-bold tracking-[0.15em] uppercase opacity-50">
        {t('messages:negotiateDeals')}
      </p>
    </div>
  )
}
