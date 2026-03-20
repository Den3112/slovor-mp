'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, Award, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface SuccessScoreProps {
  score: number
  percentile: number
  trend: 'up' | 'down' | 'neutral'
}

export function SuccessScore({ score, percentile, trend }: SuccessScoreProps) {
  const { t } = useTranslation(['dashboard'])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-border/50 relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 shadow-xl"
    >
      {/* Decorative background pulse */}
      <div className="bg-primary/5 absolute inset-0 animate-pulse" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
          <TrendingUp className="text-primary h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:successScore') || 'Success Score'}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-foreground text-5xl font-black">{score}</span>
            <span className="text-muted-foreground text-xl">/100</span>
          </div>
        </div>

        <div className="bg-muted/50 ring-border/50 flex items-center gap-3 rounded-2xl px-4 py-2 ring-1">
          <Target className="text-primary h-4 w-4" />
          <span className="text-foreground text-xs font-bold">
            {t('dashboard:topPercentile', { percentile: percentile })}
          </span>
          <div
            className={cn(
              'ml-1 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
              trend === 'up'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
            +12
          </div>
        </div>

        <p className="text-muted-foreground max-w-[200px] text-[10px] leading-relaxed">
          {t('dashboard:performanceGood')}
        </p>

        <button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold shadow-lg transition-all hover:scale-[1.02]">
          <Award className="h-4 w-4" />
          {t('dashboard:reachProLevel')}
        </button>
      </div>
    </motion.div>
  )
}
