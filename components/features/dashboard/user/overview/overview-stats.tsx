import Link from 'next/link'
import { Package, Eye, Heart, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'
import { useTranslation } from '@/lib/i18n'
import { OverviewStatsProps } from './types'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  const { t, locale } = useTranslation(['dashboard', 'profile'])

  return (
    <motion.div
      variants={item}
      className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:grid-cols-4 sm:gap-6"
    >
      <Link href={`/${locale}/dashboard/listings`}>
        <StatsCard
          label={t('dashboard:active')}
          value={stats.activeListings.toLocaleString()}
          icon={Package}
          delay={0.1}
        />
      </Link>
      <Link href={`/${locale}/dashboard/listings`}>
        <StatsCard
          label={t('dashboard:views')}
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          trend={{ value: 12, direction: 'up', label: t('dashboard:thisWeek') }}
          delay={0.2}
        />
      </Link>
      <Link href={`/${locale}/favorites`}>
        <StatsCard
          label={t('dashboard:favorites')}
          value={stats.favorites.toLocaleString()}
          icon={Heart}
          delay={0.3}
        />
      </Link>
      <Link href={`/${locale}/messages`}>
        <StatsCard
          label={t('profile:inbox')}
          value={stats.messages.toLocaleString()}
          icon={MessageCircle}
          delay={0.4}
        />
      </Link>
    </motion.div>
  )
}
