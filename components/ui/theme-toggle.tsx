'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-muted/20">
                <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
            </button>
        )
    }

    const isDark = theme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
                'group relative flex h-10 w-10 items-center justify-center rounded-full border border-border/40 transition-all hover:border-primary/50',
                isDark ? 'bg-muted/20 hover:bg-muted/40' : 'bg-primary/10 hover:bg-primary/20'
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <Sun
                className={cn(
                    'h-4 w-4 transition-all',
                    isDark
                        ? 'rotate-90 scale-0 opacity-0'
                        : 'rotate-0 scale-100 text-primary opacity-100'
                )}
            />
            <Moon
                className={cn(
                    'absolute h-4 w-4 transition-all',
                    isDark
                        ? 'rotate-0 scale-100 text-primary opacity-100'
                        : '-rotate-90 scale-0 opacity-0'
                )}
            />
        </button>
    )
}
