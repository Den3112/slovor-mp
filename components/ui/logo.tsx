'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
    locale?: string
    className?: string
    showText?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function Logo({ locale, className, showText = true, size = 'md' }: LogoProps) {
    const href = locale ? `/${locale}` : '/'

    const sizes = {
        sm: {
            box: 'h-8 w-8',
            text: 'text-lg',
            icon: 'text-base'
        },
        md: {
            box: 'h-9 w-9 md:h-11 md:w-11',
            text: 'text-xl md:text-3xl',
            icon: 'text-lg md:text-2xl'
        },
        lg: {
            box: 'h-12 w-12 md:h-16 md:w-16',
            text: 'text-2xl md:text-4xl',
            icon: 'text-xl md:text-3xl'
        }
    }

    const currentSize = sizes[size]

    return (
        <Link
            href={href}
            className={cn("group relative z-10 flex items-center gap-2 md:gap-3", className)}
            data-testid="logo"
        >
            <div className={cn("relative transition-transform duration-500 group-hover:scale-105", currentSize.box)}>
                <div className="absolute inset-0 rotate-6 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-500 to-indigo-400 shadow-lg shadow-indigo-500/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 md:rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/20 bg-white/20 font-black text-white md:rounded-2xl">
                    <span className={currentSize.icon}>S</span>
                </div>
            </div>
            {showText && (
                <span className={cn(
                    "font-heading text-foreground group-hover:text-primary flex items-baseline font-black tracking-tighter transition-colors",
                    currentSize.text
                )}>
                    Slovor
                    <span className="text-primary group-hover:animate-bounce-subtle">.</span>
                </span>
            )}
        </Link>
    )
}
