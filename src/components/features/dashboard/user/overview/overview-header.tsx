import Link from 'next/link'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { OverviewHeaderProps } from './types'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function OverviewHeader({ user }: OverviewHeaderProps) {
  const { t, locale } = useTranslation([
    'common',
    'dashboard',
    'createListing',
    'profile',
  ])

  return (
    <motion.div
      variants={item}
      className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          {t('common:dashboard')}
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('dashboard:welcomeBack')},{' '}
          <span className="text-foreground">
            {user.user_metadata?.display_name ||
              user.user_metadata?.full_name ||
              user.email?.split('@')[0]}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          asChild
          className="border-border/60 hidden h-10 rounded-xl px-6 text-[10px] font-bold tracking-widest uppercase sm:flex"
        >
          <Link href={`/${locale}/dashboard/settings`}>
            {t('profile:settings')}
          </Link>
        </Button>
        <Button
          asChild
          className="shadow-primary/20 h-10 rounded-xl px-6 text-[10px] font-bold tracking-widest uppercase shadow-lg"
        >
          <Link href={`/${locale}/post`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createListing:publish')}
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
