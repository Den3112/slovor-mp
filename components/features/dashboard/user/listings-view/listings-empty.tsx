'use client'

import { Package } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ListingsEmpty() {
  const { t, locale } = useTranslation(['common', 'dashboard', 'createListing'])

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <Package className="text-muted-foreground/40 h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-bold tracking-widest uppercase">
        {t('dashboard:noListingsYet')}
      </h3>
      <p className="text-muted-foreground mx-auto mb-8 max-w-xs text-sm font-medium">
        {t('dashboard:noListingsDesc')}
      </p>
      <Button
        asChild
        className="shadow-primary/20 h-12 rounded-xl px-8 text-[10px] font-bold tracking-widest uppercase shadow-lg"
      >
        <Link href={`/${locale}/post`}>{t('createListing:publish')}</Link>
      </Button>
    </div>
  )
}
