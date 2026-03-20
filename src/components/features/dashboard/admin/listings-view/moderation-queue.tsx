'use client'

import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Listing } from '@/lib/api'
import { ModerationCard } from './moderation-card'
import { SuspicionIssue } from './types'

interface ModerationQueueProps {
  listings: Listing[]
  isLoading: boolean
  getSuspicion: (listing: Listing) => SuspicionIssue[]
  handleAction: (id: string, status: 'active' | 'rejected') => Promise<void>
  locale: string
}

export function ModerationQueue({
  listings,
  isLoading,
  getSuspicion,
  handleAction,
  locale,
}: ModerationQueueProps) {
  const { t } = useTranslation(['admin'])
  if (isLoading) {
    return (
      <div className="border-border/40 flex h-64 items-center justify-center rounded-xl border-2 border-dashed">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
          <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            {t('admin:loadingQueue')}
          </span>
        </div>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="border-border/40 bg-muted/5 flex h-64 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed">
        <CheckCircle2 className="text-muted-foreground/20 h-12 w-12" />
        <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          {t('admin:queueClear')}
        </span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {listings.map((listing) => (
        <ModerationCard
          key={listing.id}
          listing={listing}
          issues={getSuspicion(listing)}
          onAction={handleAction}
          locale={locale}
        />
      ))}
    </div>
  )
}
