'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        style={{
          width: '40px',
          height: '40px',
          minHeight: '40px',
          maxHeight: '40px',
        }}
        className={cn(
          'border-border/40 bg-muted/20 flex items-center justify-center rounded-lg border',
          className
        )}
      >
        <div className="bg-muted h-4 w-4 animate-pulse rounded-lg" />
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        width: '40px',
        height: '40px',
        minHeight: '40px',
        maxHeight: '40px',
      }}
      className={cn(
        'group border-border/40 hover:border-primary/50 relative flex shrink-0 items-center justify-center rounded-lg border transition-all',
        isDark
          ? 'bg-muted/40 hover:bg-muted/60 text-primary-foreground'
          : 'bg-muted/50 hover:bg-muted/80 text-primary',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        className={cn(
          'h-4 w-4 transition-all',
          isDark
            ? 'scale-0 rotate-90 opacity-0'
            : 'text-primary scale-100 rotate-0 opacity-100'
        )}
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all',
          isDark
            ? 'text-primary scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0'
        )}
      />
    </button>
  )
}
