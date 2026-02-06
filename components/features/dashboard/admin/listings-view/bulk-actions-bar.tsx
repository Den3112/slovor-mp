'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface BulkActionsBarProps {
    selectedCount: number
    onAction: (status: 'active' | 'rejected') => void
    onClear: () => void
}

export function BulkActionsBar({ selectedCount, onAction, onClear }: BulkActionsBarProps) {
    if (selectedCount === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-50 bg-foreground text-background px-8 py-4 rounded-xl shadow-lg flex items-center gap-8 border border-white/10"
        >
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                    {selectedCount}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Selected items</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex gap-3">
                <Button
                    size="sm"
                    onClick={() => onAction('active')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest border-0"
                >
                    Approve All
                </Button>
                <Button
                    size="sm"
                    onClick={() => onAction('rejected')}
                    variant="destructive"
                    className="rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest border-0"
                >
                    Reject All
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClear}
                    className="text-white/40 hover:text-white rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5"
                >
                    Dismiss
                </Button>
            </div>
        </motion.div>
    )
}
