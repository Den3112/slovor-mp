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
            <Card className={cn(
                'h-full relative overflow-hidden group transition-all duration-300 border-border hover:border-primary/40 shadow-card',
                className
            )}>
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5 min-w-0">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                {label}
                            </p>
                            <p className="text-[28px] font-bold tracking-tight leading-none text-foreground">
                                {value}
                            </p>
                            {(description || trend) && (
                                <div className="flex items-center gap-2 mt-1.5">
                                    {trend && (
                                        <div className={cn(
                                            "flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-tight",
                                            trend.direction === 'up' ? "text-success" :
                                                trend.direction === 'down' ? "text-destructive" : "text-amber-500"
                                        )}>
                                            {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
                                            {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
                                            {trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
                                            <span>{trend.value}%</span>
                                        </div>
                                    )}
                                    {description && (
                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate">
                                            {description}
                                        </span>
                                    )}
                                    {trend?.label && !description && (
                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate">
                                            {trend.label}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        {Icon && (
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-transform duration-300 group-hover:scale-110">
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Background Decoration */}
                {Icon && (
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
                        <Icon size={100} strokeWidth={1} />
                    </div>
                )}
            </Card>
        </motion.div>
    )
}
