'use client'

import { Package } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ListingsEmpty() {
  const { t, locale } = useTranslation(['common', 'dashboard', 'createListing'])

  return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
      <div className="bg-primary/5 border-primary/5 mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border shadow-inner transition-transform duration-700 hover:scale-110">
        <Package className="text-primary/20 h-10 w-10" />
      </div>
      <h3 className="text-foreground mb-3 text-2xl font-black tracking-tighter uppercase">
        {t('dashboard:noListingsYet')}
      </h3>
      <p className="text-foreground/40 mx-auto mb-10 max-w-xs text-[13px] leading-relaxed font-black tracking-tight uppercase">
        {t('dashboard:noListingsDesc')}
      </p>
      <Button
        asChild
        className="shadow-primary/20 hover:bg-primary/90 h-14 rounded-2xl px-10 text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all active:scale-95"
      >
        <Link href={`/${locale}/post`}>{t('createListing:publish')}</Link>
      </Button>
    </div>
  )
}
