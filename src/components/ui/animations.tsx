'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimationProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  delay?: number
  duration?: number
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    {...props}
  >
    {children}
  </motion.div>
)

export const SlideIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  ...props
}: AnimationProps & { direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerContainer = ({
  children,
  delay = 0,
  ...props
}: AnimationProps) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, ...props }: HTMLMotionProps<'div'>) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    }}
    {...props}
  >
    {children}
  </motion.div>
)

export const GlassCard = ({
  children,
  className,
  ...props
}: AnimationProps) => (
  <motion.div
    whileHover={{ scale: 1.01, translateY: -2 }}
    className={cn(
      'bg-background/40 overflow-hidden rounded-4xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
)
