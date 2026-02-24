'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

interface ListingsHeaderProps {
  count: number
}

export function ListingsHeader({ count }: ListingsHeaderProps) {
  const { t, locale } = useTranslation(['dashboard', 'createListing', 'common'])

  return (
    <motion.div
      variants={item}
      className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
    >
      <div className="space-y-1">
        <h1 className="text-foreground text-4xl font-black tracking-tighter uppercase">
          {t('dashboard:myListings')}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-primary/40 text-[10px] font-black tracking-[0.25em] uppercase">
            {t('dashboard:manageListings')}
          </p>
          <div className="bg-primary/10 h-1 w-1 rounded-full" />
          <p className="text-primary text-[10px] font-black tracking-[0.25em] uppercase">
            {t('common:listings', { count })}
          </p>
        </div>
      </div>
      <Button
        asChild
        className="shadow-primary/20 hover:bg-primary/90 h-12 rounded-2xl px-6 font-black tracking-widest uppercase shadow-xl transition-all active:scale-95"
      >
        <Link href={`/${locale}/post`}>
          <Plus className="mr-2 h-4.5 w-4.5 stroke-3" />
          {t('createListing:publish')}
        </Link>
      </Button>
    </motion.div>
  )
}
