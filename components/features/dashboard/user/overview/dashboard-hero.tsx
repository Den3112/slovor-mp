'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Zap, Sparkles, Trophy, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { User } from '@supabase/supabase-js'
import { DashboardStats } from '@/lib/api/dashboard-stats'

interface DashboardHeroProps {
  user: User
  stats: DashboardStats
}

export function DashboardHero({ user, stats }: DashboardHeroProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0]
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting(t('dashboard:goodMorning'))
    else if (hour < 18) setGreeting(t('dashboard:goodAfternoon'))
    else setGreeting(t('dashboard:goodEvening'))
  }, [t])

  return (
    <div className="relative flex h-full flex-col justify-between p-8 pt-10">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="bg-primary/40 absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full blur-[100px]" />
        <div className="bg-purple-500/40 absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="bg-muted/50 border-border text-primary flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="h-3 w-3" />
            <span>{t('dashboard:welcomeHeader') || 'COMMAND CENTER'}</span>
          </div>

          {user.user_metadata?.email_confirmed && (
            <div className="bg-muted/50 border-border text-emerald-500 flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck className="h-3 w-3" />
              <span>{t('common:verified') || 'VERIFIED'}</span>
            </div>
          )}
        </motion.div>

        {/* Hero Text */}
        <div className="space-y-1">
          <h1 className="text-foreground text-4xl font-bold tracking-tight lg:text-5xl">
            {greeting || 'Hello'},{' '}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-500">
              {userName}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
            {t('dashboard:heroDescription')}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="bg-card border-border hover:border-primary/40 group flex flex-col gap-1 rounded-xl border p-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {t('dashboard:totalViews')}
            </span>
            <Zap className="text-amber-500 h-4 w-4" />
          </div>
          <span className="text-foreground text-2xl font-bold tabular-nums">
            {stats.totalViews.toLocaleString()}
          </span>
        </div>

        <div className="bg-card border-border hover:border-emerald-500/40 group flex flex-col gap-1 rounded-xl border p-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {t('dashboard:active')}
            </span>
            <ArrowUpRight className="text-emerald-500 h-4 w-4" />
          </div>
          <span className="text-foreground text-2xl font-bold tabular-nums">
            {stats.activeListings.toLocaleString()}
          </span>
        </div>

        <div className="bg-card border-border hover:border-blue-500/40 group flex flex-col gap-1 rounded-xl border p-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              RATING
            </span>
            <Trophy className="text-blue-500 h-4 w-4" />
          </div>
          <span className="text-foreground text-2xl font-bold tabular-nums">
            5.0
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center">
          <Button className="w-full h-full min-h-[80px] rounded-xl text-xs font-bold uppercase tracking-wider" asChild>
            <Link href="/dashboard/listings/new">
              Post New Listing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
