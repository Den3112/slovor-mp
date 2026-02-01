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
    const max = Math.max(...data.map(d => d.value))

    return (
        <div className="h-full w-full flex items-end justify-between gap-2 md:gap-4 px-2 pb-2">
            {data.map((item, index) => (
                <div key={item.day} className="h-full flex flex-col justify-end items-center flex-1 gap-3 group relative cursor-pointer">

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-black py-1 px-2 rounded-lg whitespace-nowrap z-10 pointer-events-none transform translate-y-1 group-hover:translate-y-0 duration-200">
                        {item.label}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-foreground"></div>
                    </div>

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${(item.value / max) * 100}%`, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                        }}
                        className={cn(
                            "w-full max-w-[40px] rounded-t-2xl min-h-[10px] relative overflow-hidden",
                            index === 4 ? "bg-primary shadow-[0_0_20px_-5px_var(--color-primary)]" : "bg-muted-foreground/20 hover:bg-muted-foreground/30"
                        )}
                    >
                        {/* Inner Gradient for visual flair */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                    </motion.div>

                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                        {item.day}
                    </span>
                </div>
            ))}
        </div>
    )
}
