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
          'group border-border hover:border-primary/40 shadow-card bg-card relative h-full overflow-hidden transition-all duration-300',
          className
        )}
      >
        <CardContent className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 space-y-1.5">
              <p className="text-muted-foreground text-[10px] leading-none font-bold tracking-widest uppercase">
                {label}
              </p>
              <p className="text-foreground text-[28px] leading-none font-bold tracking-tight">
                {value}
              </p>
              {(description || trend) && (
                <div className="mt-1.5 flex items-center gap-2">
                  {trend && (
                    <div
                      className={cn(
                        'flex items-center gap-0.5 text-[10px] font-bold tracking-tight uppercase',
                        trend.direction === 'up'
                          ? 'text-success'
                          : trend.direction === 'down'
                            ? 'text-destructive'
                            : 'text-amber-500'
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
                    <span className="text-muted-foreground truncate text-[10px] font-bold tracking-widest uppercase">
                      {description}
                    </span>
                  )}
                  {trend?.label && !description && (
                    <span className="text-muted-foreground truncate text-[10px] font-bold tracking-widest uppercase">
                      {trend.label}
                    </span>
                  )}
                </div>
              )}
            </div>
            {Icon && (
              <div className="bg-primary/10 text-primary rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
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
