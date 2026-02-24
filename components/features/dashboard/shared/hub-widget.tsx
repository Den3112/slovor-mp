'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { BentoTile } from '@/components/ui/bento'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HubWidgetProps {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  rowSpan?: number
  className?: string
  contentClassName?: string
  loading?: boolean
  error?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ElementType
    variant?: 'default' | 'ghost' | 'outline' | 'secondary'
  }
  footer?: React.ReactNode
  noPadding?: boolean
}

export function HubWidget({
  title,
  icon: Icon,
  children,
  colSpan = 4,
  rowSpan = 1,
  className,
  contentClassName,
  loading = false,
  error,
  action,
  footer,
  noPadding = false,
}: HubWidgetProps) {
  return (
    <BentoTile
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={cn('bg-card border-border flex flex-col shadow-md', className)}
    >
      {/* Widget Header */}
      <div className="border-primary/5 bg-primary/5 flex items-center justify-between border-b p-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary shadow-primary/20 flex h-7 w-7 items-center justify-center rounded-xl shadow-lg">
            {Icon && <Icon className="h-4 w-4 text-white" />}
          </div>
          <h3 className="text-primary/40 text-[10px] font-black tracking-[0.25em] uppercase">
            {title}
          </h3>
        </div>
        {action && (
          <Button
            variant={action.variant || 'ghost'}
            size="sm"
            onClick={action.onClick}
            className="hover:bg-primary/10 hover:text-primary h-8 gap-2 rounded-xl px-4 text-[9px] font-black tracking-[0.15em] uppercase transition-all"
          >
            {action.icon && <action.icon className="h-3.5 w-3.5" />}
            {action.label}
          </Button>
        )}
      </div>

      {/* Widget Content */}
      <div
        className={cn(
          'relative min-h-0 flex-1',
          !noPadding && 'p-6',
          contentClassName
        )}
      >
        {loading ? (
          <div className="bg-background/20 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="bg-destructive/10 rounded-full p-3">
              <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-xs font-medium">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Widget Footer */}
      {footer && (
        <div className="border-primary/5 bg-primary/5 border-t p-4 text-[10px] font-medium tracking-wide">
          {footer}
        </div>
      )}
    </BentoTile>
  )
}
