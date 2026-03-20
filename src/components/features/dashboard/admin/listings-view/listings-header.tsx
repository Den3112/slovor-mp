'use client'

import { Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function ListingsHeader() {
  const { t } = useTranslation(['admin'])

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tighter uppercase">
        <Layers className="text-primary h-8 w-8" strokeWidth={2.5} />
        {t('admin:moderation')}
      </h1>
      <p className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.3em] uppercase">
        {t('admin:reviewManageListings')}
      </p>
    </div>
  )
}
