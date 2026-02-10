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
    1: 'col-span-full lg:col-span-1',
    2: 'col-span-full lg:col-span-2',
    3: 'col-span-full lg:col-span-3 drop-shadow-sm',
    4: 'col-span-full lg:col-span-4',
    5: 'col-span-full lg:col-span-5',
    6: 'col-span-full lg:col-span-6',
    7: 'col-span-full lg:col-span-7',
    8: 'col-span-full lg:col-span-8',
    9: 'col-span-full lg:col-span-9',
    10: 'col-span-full lg:col-span-10',
    11: 'col-span-full lg:col-span-11',
    12: 'col-span-full lg:col-span-12',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(
        'border-border bg-card shadow-card hover:border-border/80 group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg active:scale-[0.98]',
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
