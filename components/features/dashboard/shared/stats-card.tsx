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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
        >
            <Card className={cn("overflow-hidden border-border/60 shadow-sm transition-all hover:shadow-md", className)}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
                            {label}
                        </h3>
                        {Icon && (
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                <Icon className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-bold tracking-tight">
                            {value}
                        </div>
                        {(description || trend) && (
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                {trend && (
                                    <span
                                        className={cn(
                                            "flex items-center font-medium",
                                            trend.direction === 'up' && "text-emerald-500",
                                            trend.direction === 'down' && "text-rose-500",
                                            trend.direction === 'neutral' && "text-yellow-500"
                                        )}
                                    >
                                        {trend.direction === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                                        {trend.direction === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                                        {trend.direction === 'neutral' && <Minus className="mr-1 h-3 w-3" />}
                                        {trend.value}%
                                    </span>
                                )}
                                {description && (
                                    <span className={cn(trend && "border-l border-border pl-2")}>
                                        {description}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Decorative Bottom Line */}
                <div className="h-1 w-full bg-primary/5" />
            </Card>
        </motion.div>
    )
}
