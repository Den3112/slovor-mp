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
      className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
    >
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          {t('dashboard:myListings')}
        </h1>
        <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('dashboard:manageListings')} •{' '}
          <span className="text-primary">
            {t('common:listings', { count })}
          </span>
        </p>
      </div>
      <Button asChild className="shadow-primary/20 shadow-lg">
        <Link href={`/${locale}/post`}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createListing:publish')}
        </Link>
      </Button>
    </motion.div>
  )
}
