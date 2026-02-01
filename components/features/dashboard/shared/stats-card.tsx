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
            transition={{ duration: 0.3, delay, ease: 'easeOut' }}
        >
            <Card className={cn('h-full transition-shadow hover:shadow-md', className)}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-muted-foreground truncate">
                                {label}
                            </p>
                            <p className="mt-1 text-2xl font-bold tracking-tight">
                                {value}
                            </p>
                            {(description || trend) && (
                                <div className="mt-1 flex items-center gap-2 text-xs">
                                    {trend && (
                                        <span
                                            className={cn(
                                                'inline-flex items-center font-medium',
                                                trend.direction === 'up' && 'text-success',
                                                trend.direction === 'down' && 'text-destructive',
                                                trend.direction === 'neutral' && 'text-warning'
                                            )}
                                        >
                                            {trend.direction === 'up' && <TrendingUp className="mr-0.5 h-3 w-3" />}
                                            {trend.direction === 'down' && <TrendingDown className="mr-0.5 h-3 w-3" />}
                                            {trend.direction === 'neutral' && <Minus className="mr-0.5 h-3 w-3" />}
                                            {trend.value}%
                                        </span>
                                    )}
                                    {description && (
                                        <span className="text-muted-foreground truncate">
                                            {description}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        {Icon && (
                            <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                                <Icon className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
