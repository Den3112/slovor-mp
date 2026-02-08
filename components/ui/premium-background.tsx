'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PremiumBackgroundProps {
  variant?: 'mesh' | 'dots' | 'simple'
  className?: string
  children?: React.ReactNode
}

export function PremiumBackground({
  variant = 'mesh',
  className,
  children,
}: PremiumBackgroundProps) {
  return (
    <div
      className={cn(
        'bg-background relative min-h-screen w-full overflow-hidden',
        className
      )}
    >
      {/* Decorative Gradients */}
      {variant === 'mesh' && (
        <>
          <div
            className="bg-primary/10 dark:bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] animate-pulse rounded-full blur-[120px]"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute top-[20%] -right-[5%] h-[30%] w-[30%] animate-pulse rounded-full bg-blue-500/5 blur-[100px]"
            style={{ animationDuration: '12s' }}
          />
          <div
            className="absolute -bottom-[10%] left-[20%] h-[35%] w-[35%] animate-pulse rounded-full bg-purple-500/5 blur-[110px]"
            style={{ animationDuration: '10s' }}
          />
        </>
      )}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-[0.02]" />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
