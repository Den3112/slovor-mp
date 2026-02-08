'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[minmax(120px,auto)] grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-12 lg:gap-6',
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoTileProps {
  children: React.ReactNode
  className?: string
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  rowSpan?: number
  delay?: number
}

export function BentoTile({
  children,
  className,
  colSpan = 4,
  rowSpan = 1,
  delay = 0,
}: BentoTileProps) {
  const colSpans = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3 drop-shadow-sm',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    11: 'lg:col-span-11',
    12: 'lg:col-span-12',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(
        'border-border/40 bg-card/70 shadow-card hover:border-border/60 dark:bg-card/50 group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:shadow-lg',
        colSpans[colSpan],
        className
      )}
      style={{
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
      }}
    >
      {children}
    </motion.div>
  )
}
