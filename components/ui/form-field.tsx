'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
    label: string
    error?: string
    children: React.ReactNode
    className?: string
    required?: boolean
    description?: string
}

export function FormField({
    label,
    error,
    children,
    className,
    required,
    description,
}: FormFieldProps) {
    return (
        <div className={cn('space-y-2.5', className)}>
            <div className="flex items-center justify-between px-1">
                <Label className="text-muted-foreground/80 text-[10px] font-black tracking-[0.2em] uppercase">
                    {label}
                    {required && <span className="text-primary ml-1">*</span>}
                </Label>
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="text-destructive text-[10px] font-bold uppercase tracking-wider"
                        >
                            {error}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <div className="group relative">{children}</div>

            {description && !error && (
                <p className="text-muted-foreground/50 px-1 text-xs">{description}</p>
            )}
        </div>
    )
}
