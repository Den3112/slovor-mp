'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PullToRefreshProps {
    children: React.ReactNode
    onRefresh?: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
    const router = useRouter()
    const [pullDistance, setPullDistance] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isPulling, setIsPulling] = useState(false)
    const startY = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const PULL_THRESHOLD = 80
    const MAX_PULL = 120

    const handleTouchStart = (e: React.TouchEvent) => {
        // Only start pulling if at the top of the container
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        if (scrollTop === 0 && e.touches[0]) {
            startY.current = e.touches[0].pageY
            setIsPulling(true)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isPulling || isRefreshing || !e.touches[0]) return

        const currentY = e.touches[0].pageY
        const diff = currentY - startY.current

        if (diff > 0) {
            // Apply resistance
            const pull = Math.min(diff * 0.4, MAX_PULL)
            setPullDistance(pull)

            // Prevent default scroll when pulling down at top
            if (e.cancelable) {
                e.preventDefault()
            }
        } else {
            setPullDistance(0)
            setIsPulling(false)
        }
    }

    const handleTouchEnd = async () => {
        if (!isPulling || isRefreshing) return

        if (pullDistance >= PULL_THRESHOLD) {
            setIsRefreshing(true)
            setPullDistance(PULL_THRESHOLD)

            try {
                if (onRefresh) {
                    await onRefresh()
                } else {
                    router.refresh()
                    // Artificial delay for feedback
                    await new Promise(resolve => setTimeout(resolve, 800))
                }
            } finally {
                setIsRefreshing(false)
                setPullDistance(0)
            }
        } else {
            setPullDistance(0)
        }
        setIsPulling(false)
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull Indicator Area */}
            <motion.div
                className="absolute left-0 right-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none"
                style={{
                    height: pullDistance,
                    top: 0,
                    opacity: pullDistance / PULL_THRESHOLD
                }}
            >
                <div className="flex flex-col items-center justify-center gap-1">
                    <motion.div
                        animate={{
                            rotate: isRefreshing ? 360 : (pullDistance * 2),
                        }}
                        transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring", damping: 12 }}
                        className="bg-primary text-white p-2 rounded-full shadow-lg shadow-primary/20"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </motion.div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">
                        {pullDistance >= PULL_THRESHOLD ? (isRefreshing ? 'Refreshing...' : 'Release to refresh') : 'Pull down'}
                    </span>
                </div>
            </motion.div>

            {/* Content with springy offset */}
            <motion.div
                animate={{ y: pullDistance }}
                transition={{ type: "spring", damping: 20, stiffness: 150 }}
                className="h-full"
            >
                {children}
            </motion.div>
        </div>
    )
}
