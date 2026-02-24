'use client'

import { MessageSquarePlus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function MessagesPlaceholder() {
  const { t } = useTranslation(['messages', 'common'])
  return (
    <div className="glass-panel relative flex h-full flex-col items-center justify-center overflow-hidden border-none p-8 text-center shadow-2xl! shadow-black/5">
      {/* Aurora Mesh Background */}
      <div className="from-primary/5 to-primary/10 absolute inset-0 -z-10 bg-linear-to-tr via-transparent opacity-60" />
      <div className="bg-primary/5 absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-[120px]" />

      <div className="group relative mb-10 cursor-default">
        <div className="bg-primary/20 absolute -inset-8 rounded-full opacity-0 blur-3xl transition-opacity duration-1000 group-hover:opacity-100" />
        <div className="from-primary/15 to-primary/5 border-primary/20 shadow-primary/5 relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] border bg-linear-to-br shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6">
          <MessageSquarePlus className="text-primary h-14 w-14 drop-shadow-lg" />
        </div>
        <div className="bg-card border-border absolute -right-4 -bottom-4 flex h-12 w-12 animate-bounce items-center justify-center rounded-2xl border shadow-xl delay-700">
          <div className="text-2xl">👋</div>
        </div>
      </div>

      <h3 className="text-foreground mb-4 text-4xl font-black tracking-tighter uppercase sm:text-5xl">
        {t('messages:selectConversation')}
      </h3>
      <p className="mx-auto max-w-xs text-[11px] font-black tracking-[0.4em] uppercase opacity-30">
        {t('messages:negotiateDeals')}
      </p>
    </div>
  )
}
