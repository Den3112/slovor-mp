'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
    locale?: string
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function Logo({ locale, className, size = 'md' }: LogoProps) {
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
            className={cn("group relative z-10 flex items-center", className)}
            data-testid="logo"
        >
            <div className={cn("relative transition-transform duration-500 group-hover:scale-105 overflow-hidden rounded-xl", currentSize.box)}>
                <Image
                    src="/logo.png"
                    alt="Slovor Logo"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </Link>
    )
}
