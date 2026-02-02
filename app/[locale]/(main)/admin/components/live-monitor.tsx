'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    UserPlus,
    Package,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Event {
    id: string
    type: 'user' | 'listing' | 'report' | 'approved' | 'message' | 'system'
    message: string
    time: string
    timestamp: number
}

const INITIAL_EVENTS: Event[] = [
    { id: '1', type: 'system', message: 'System Monitor initialized', time: 'Just now', timestamp: Date.now() },
    { id: '2', type: 'user', message: 'New user registered: alex_smith', time: '2m ago', timestamp: Date.now() - 120000 },
    { id: '3', type: 'listing', message: 'New listing created: iPhone 15 Pro', time: '5m ago', timestamp: Date.now() - 300000 },
    { id: '4', type: 'report', message: 'Urgent: Report on listing #4829', time: '12m ago', timestamp: Date.now() - 720000 },
]

const EVENT_CONFIG = {
    user: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    listing: { icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    report: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    approved: { icon: CheckCircle2, color: 'text-success', bg: 'bg-emerald-500/10' },
    message: { icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    system: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
}

export function LiveMonitor() {
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS)

    // Simulate real-time events
    useEffect(() => {
        const messages = [
            { type: 'user', message: 'New user joined: sarah_j' },
            { type: 'listing', message: 'Listing boosted: Mac Studio' },
            { type: 'approved', message: 'Listing approved: Canon R5' },
            { type: 'report', message: 'System flagged listing #2930' },
            { type: 'message', message: 'Support ticket: #9201 resolved' }
        ] as const

        const interval = setInterval(() => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)] || messages[0]
            const newEvent: Event = {
                id: Math.random().toString(36).substr(2, 9),
                type: randomMsg.type,
                message: randomMsg.message,
                time: 'Just now',
                timestamp: Date.now()
            }
            setEvents(prev => [newEvent, ...prev.slice(0, 5)])
        }, 8000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Live Monitor
                    </span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    Real-time
                </span>
            </div>

            <div className="space-y-3 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/40" />

                <AnimatePresence initial={false}>
                    {events.map((event) => {
                        const config = EVENT_CONFIG[event.type]
                        const Icon = config.icon

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 10, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="group relative pl-10"
                            >
                                {/* Circle Icon */}
                                <div className={cn(
                                    "absolute left-0 top-1 h-10 w-10 rounded-xl flex items-center justify-center border border-border/40 bg-card z-10 transition-transform group-hover:scale-110 shadow-sm",
                                    config.bg,
                                    config.color
                                )}>
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="space-y-0.5 py-1">
                                    <p className="text-[11px] font-black text-foreground leading-tight tracking-tight line-clamp-1 uppercase">
                                        {event.message}
                                    </p>
                                    <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                                        {event.time}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            <div className="pt-2">
                <button className="w-full py-2 rounded-lg border border-border/60 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary hover:border-primary/40 hover:bg-muted/50 transition-all">
                    View Full Audit Log
                </button>
            </div>
        </div>
    )
}
