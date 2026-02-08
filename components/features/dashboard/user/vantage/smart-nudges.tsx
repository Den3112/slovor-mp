'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, Target, Lightbulb } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface Nudge {
  id: string
  type: 'tip' | 'action' | 'alert'
  title: string
  description: string
  cta: string
}

export function SmartNudges() {
  const { t } = useTranslation(['dashboard'])

  const nudges: Nudge[] = [
    {
      id: '1',
      type: 'tip',
      title: t('dashboard:nudgePhotosTitle'),
      description: t('dashboard:nudgePhotosDesc'),
      cta: t('dashboard:nudgePhotosCta'),
    },
    {
      id: '2',
      type: 'action',
      title: t('dashboard:nudgeMarketTitle'),
      description: t('dashboard:nudgeMarketDesc'),
      cta: t('dashboard:nudgeMarketCta'),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
          <Lightbulb className="text-primary h-3.5 w-3.5" />
          {t('dashboard:smartNudges')}
        </h3>
        <Sparkles className="text-primary h-3.5 w-3.5 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence>
          {nudges.map((nudge, idx) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border-border/50 group hover:border-primary/30 relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="bg-primary/5 absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full blur-2xl" />

              <div className="relative space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    {nudge.type === 'tip' ? (
                      <Target className="text-primary h-4 w-4" />
                    ) : (
                      <Zap className="text-primary h-4 w-4" />
                    )}
                  </div>
                  <span className="text-foreground text-sm font-bold">
                    {nudge.title}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  {nudge.description}
                </p>

                <button className="text-primary hover:text-primary-foreground flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-all hover:translate-x-1">
                  {nudge.cta}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
