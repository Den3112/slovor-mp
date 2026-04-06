'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMounted } from '@/shared/lib/hooks/use-mounted'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('common')
  const mounted = useMounted()

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
          'border-border/40 bg-muted/20 flex items-center justify-center rounded-xl border',
          className
        )}
        aria-label="Toggle theme"
      >
        <div className="bg-muted h-4 w-4 animate-pulse rounded-xl" />
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
        'group border-border/40 hover:border-primary/50 relative flex shrink-0 items-center justify-center rounded-xl border transition-all',
        isDark
          ? 'bg-muted/40 hover:bg-muted/60 text-primary-foreground'
          : 'bg-muted/50 hover:bg-muted/80 text-primary',
        className
      )}
      aria-label={
        isDark ? t('common:aria.switchToLight') : t('common:aria.switchToDark')
      }
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
