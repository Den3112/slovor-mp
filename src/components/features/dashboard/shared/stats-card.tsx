'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatsCardProps {
  label: string
  value: string | number
  description?: string
  icon?: React.ElementType
  trend?: {
    value: number
    label?: string
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
  delay?: number
}

export function StatsCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="h-full"
    >
      <Card
        className={cn(
          'glass-panel bg-background/40 border-primary/10 group shadow-primary/5 hover:border-primary/30 relative h-full overflow-hidden rounded-2xl shadow-xl transition-all duration-500',
          className
        )}
      >
        <CardContent className="relative z-10 p-7">
          <div className="flex items-center justify-between">
            <div className="min-w-0 space-y-2">
              <p className="text-primary/40 text-[10px] leading-none font-black tracking-[0.2em] uppercase">
                {label}
              </p>
              <p className="text-foreground text-3xl leading-none font-black tracking-tight">
                {value}
              </p>
              {(description || trend) && (
                <div className="mt-2.5 flex items-center gap-2">
                  {trend && (
                    <div
                      className={cn(
                        'flex items-center gap-0.5 rounded-xl border px-1.5 py-0.5 text-[10px] font-black tracking-tight uppercase',
                        trend.direction === 'up'
                          ? 'border-success/10 bg-success/5 text-success'
                          : trend.direction === 'down'
                            ? 'border-destructive/10 bg-destructive/5 text-destructive'
                            : 'border-amber-500/10 bg-amber-500/5 text-amber-500'
                      )}
                    >
                      {trend.direction === 'up' && (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {trend.direction === 'down' && (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {trend.direction === 'neutral' && (
                        <Minus className="h-3 w-3" />
                      )}
                      <span>{trend.value}%</span>
                    </div>
                  )}
                  {description && (
                    <span className="text-primary/40 truncate text-[10px] font-black tracking-widest uppercase">
                      {description}
                    </span>
                  )}
                  {trend?.label && !description && (
                    <span className="text-primary/40 truncate text-[10px] font-black tracking-widest uppercase">
                      {trend.label}
                    </span>
                  )}
                </div>
              )}
            </div>
            {Icon && (
              <div className="bg-primary/5 text-primary border-primary/10 group-hover:shadow-primary/20 rounded-2xl border p-3 shadow-inner transition-all duration-500 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>
        </CardContent>

        {/* Background Decoration */}
        {Icon && (
          <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.07]">
            <Icon size={100} strokeWidth={1} />
          </div>
        )}
      </Card>
    </motion.div>
  )
}
