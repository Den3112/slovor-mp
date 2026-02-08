'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Zap, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface DashboardHeroProps {
  user: any
  stats: any
}

export function DashboardHero({ user, stats }: DashboardHeroProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0]

  return (
    <div className="relative flex h-full flex-col justify-between p-8">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-10 opacity-30 dark:opacity-10">
        <div className="bg-primary absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl" />
        <div className="bg-secondary absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-primary/10 text-primary mb-4 flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
        >
          <Sparkles className="h-3 w-3" />
          {t('dashboard:welcomeHeader')}
        </motion.div>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          {t('dashboard:hello')},{' '}
          <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          {t('dashboard:heroDescription')}
        </p>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: t('dashboard:totalViews'),
            value: stats.totalViews,
            icon: Zap,
            color: 'text-amber-500',
          },
          {
            label: t('dashboard:active'),
            value: stats.activeListings,
            icon: ArrowUpRight,
            color: 'text-emerald-500',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-card/40 dark:bg-background/40 border-border/20 flex flex-col gap-1 rounded-2xl border p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <item.icon className={cn('h-4 w-4', item.color)} />
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {item.label}
              </span>
            </div>
            <span className="text-foreground text-2xl font-bold">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
