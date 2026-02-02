'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function ActivityChart() {
    // Mock data for the last 7 days
    const [data] = useState([
        { day: 'Mon', value: 45, label: '45 Listings' },
        { day: 'Tue', value: 32, label: '32 Listings' },
        { day: 'Wed', value: 68, label: '68 Listings' },
        { day: 'Thu', value: 54, label: '54 Listings' },
        { day: 'Fri', value: 89, label: '89 Listings' },
        { day: 'Sat', value: 72, label: '72 Listings' },
        { day: 'Sun', value: 50, label: '50 Listings' },
    ])

    // Detect max for scaling
    const max = 100 // Fixed max for consistency

    return (
        <div className="h-full w-full flex flex-col pt-4">
            {/* Grid & Bars Container */}
            <div className="flex-1 relative flex items-end justify-between gap-2 px-2 pb-6">

                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 px-2">
                    {[0, 25, 50, 75, 100].map((step) => (
                        <div key={step} className="w-full flex items-center gap-3">
                            <span className="text-[8px] font-bold text-muted-foreground/30 w-4 text-right">{step}</span>
                            <div className="flex-1 h-px bg-border/40" />
                        </div>
                    ))}
                </div>

                {data.map((item, index) => (
                    <div key={item.day} className="h-full flex flex-col justify-end items-center flex-1 z-10 group relative cursor-pointer pt-8">

                        {/* Tooltip */}
                        <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-all bg-foreground text-background text-[10px] font-black py-2 px-3 rounded-md shadow-sm z-50 pointer-events-none transform -translate-y-2 group-hover:translate-y-0 duration-300 border border-border">
                            <p className="opacity-40 mb-0.5 uppercase tracking-tighter text-[8px]">{item.day} Full Report</p>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <span className="text-xs tracking-tight uppercase">{item.label}</span>
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground"></div>
                        </div>

                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: `${(item.value / max) * 100}%`, opacity: 1 }}
                            transition={{
                                duration: 1,
                                delay: index * 0.05,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className={cn(
                                "w-full max-w-[40px] rounded-t-sm min-h-[4px] relative transition-all duration-300",
                                item.value > 75
                                    ? "bg-primary"
                                    : "bg-muted"
                            )}
                        >
                            {/* Interaction Overlay */}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* Labels underneath the bars - aligned with grid */}
                        <div className="absolute bottom-0 transform translate-y-full pt-1">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                                {item.day}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
