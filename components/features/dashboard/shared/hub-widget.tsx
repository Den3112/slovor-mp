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
            className={cn('flex flex-col', className)}
        >
            {/* Widget Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-primary h-4 w-4" />}
                    <h3 className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
                        {title}
                    </h3>
                </div>
                {action && (
                    <Button
                        variant={action.variant || 'ghost'}
                        size="sm"
                        onClick={action.onClick}
                        className="h-6 gap-1.5 px-2 text-[10px] font-bold uppercase tracking-wider"
                    >
                        {action.icon && <action.icon className="h-3 w-3" />}
                        {action.label}
                    </Button>
                )}
            </div>

            {/* Widget Content */}
            <div
                className={cn(
                    'flex-1 min-h-0 relative',
                    !noPadding && 'p-4 pt-2',
                    contentClassName
                )}
            >
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                        <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
                        <AlertCircle className="text-destructive h-6 w-6" />
                        <p className="text-muted-foreground text-xs">{error}</p>
                    </div>
                ) : (
                    children
                )}
            </div>

            {/* Widget Footer */}
            {footer && (
                <div className="border-border/40 bg-muted/20 border-t p-3 text-xs">
                    {footer}
                </div>
            )}
        </BentoTile>
    )
}
