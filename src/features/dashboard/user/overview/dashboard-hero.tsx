'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Zap, Sparkles, Trophy, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'

import { User } from '@supabase/supabase-js'
import { DashboardStats } from '@/entities/dashboard/api'

interface DashboardHeroProps {
  user: User
  stats: DashboardStats
}

export function DashboardHero({ user, stats }: DashboardHeroProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  const userName =
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0]
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    // Guard with setTimeout to avoid synchronous state update during render/effect phase
    const timer = setTimeout(() => {
      if (hour < 12) setGreeting(t('dashboard:goodMorning'))
      else if (hour < 18) setGreeting(t('dashboard:goodAfternoon'))
      else setGreeting(t('dashboard:goodEvening'))
    }, 0)
    return () => clearTimeout(timer)
  }, [t])

  return (
    <div className="relative flex h-full flex-col justify-between p-8 pt-10">
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="bg-primary/40 absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/40 blur-[80px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="glass-panel bg-primary/5 border-primary/10 text-primary flex items-center gap-2 rounded-full border px-4 py-1.5 text-[9px] font-black tracking-[0.25em] uppercase shadow-inner">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>{t('dashboard:welcomeHeader') || 'COMMAND CENTER'}</span>
          </div>

          {user.user_metadata?.email_confirmed && (
            <div className="glass-panel flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-1.5 text-[9px] font-black tracking-[0.25em] text-emerald-500 uppercase">
              <ShieldCheck className="h-3 w-3" />
              <span>{t('common:verified') || 'VERIFIED'}</span>
            </div>
          )}
        </motion.div>

        {/* Hero Text */}
        <div className="space-y-2">
          <h1 className="text-foreground text-5xl font-black tracking-tight lg:text-7xl">
            {greeting || 'Hello'},{' '}
            <span className="from-primary to-primary animate-gradient-x bg-linear-to-br via-purple-500 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="text-primary/40 max-w-lg text-sm leading-relaxed font-medium tracking-wide">
            {t('dashboard:heroDescription')}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass-panel bg-background/20 border-primary/5 hover:border-primary/20 group flex flex-col gap-2 rounded-2xl border p-5 transition-all duration-500">
          <div className="flex items-center justify-between">
            <span className="text-primary/40 text-[9px] font-black tracking-[0.2em] uppercase">
              {t('dashboard:totalViews')}
            </span>
            <div className="rounded-xl bg-amber-500/10 p-1.5 transition-colors group-hover:bg-amber-500/20">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <span className="text-foreground text-3xl font-black tracking-tight tabular-nums">
            {stats.totalViews.toLocaleString()}
          </span>
        </div>

        <div className="glass-panel bg-background/20 border-primary/5 group flex flex-col gap-2 rounded-2xl border p-5 transition-all duration-500 hover:border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-primary/40 text-[9px] font-black tracking-[0.2em] uppercase">
              {t('dashboard:active')}
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-1.5 transition-colors group-hover:bg-emerald-500/20">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <span className="text-foreground text-3xl font-black tracking-tight tabular-nums">
            {stats.activeListings.toLocaleString()}
          </span>
        </div>

        <div className="glass-panel bg-background/20 border-primary/5 group flex flex-col gap-2 rounded-2xl border p-5 transition-all duration-500 hover:border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-primary/40 text-[9px] font-black tracking-[0.2em] uppercase">
              {t('dashboard:rating')}
            </span>
            <div className="rounded-xl bg-blue-500/10 p-1.5 transition-colors group-hover:bg-blue-500/20">
              <Trophy className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <span className="text-foreground text-3xl font-black tracking-tight tabular-nums">
            {stats.rating?.toFixed(1) || '5.0'}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center">
          <Button
            className="shadow-primary/20 h-full min-h-[90px] w-full rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 hover:scale-[1.02] active:scale-95 lg:shadow-xl"
            asChild
          >
            <Link href="/dashboard/listings/new">
              {t('dashboard:postNewListing')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
