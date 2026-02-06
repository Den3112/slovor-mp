'use client'

import { Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function ListingsHeader() {
    const { t } = useTranslation(['admin'])

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold  tracking-tighter text-foreground uppercase flex items-center gap-3">
                <Layers className="h-8 w-8 text-primary" strokeWidth={2.5} />
                {t('admin:moderation') || 'Moderation'}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                {t('admin:reviewManageListings') || 'Review and manage marketplace content'}
            </p>
        </div>
    )
}
