'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface NavLink {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

interface BottomNavBarProps {
    navLinks: NavLink[]
    pathname: string | null
    user: SupabaseUser | null
}

export function BottomNavBar({ navLinks, pathname, user }: BottomNavBarProps) {
    const { t } = useTranslation()

    return (
        <>
            <nav className="fixed-bottom-bar border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden">
                <div className="flex items-center justify-around px-2 py-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon
                        const isActive =
                            pathname === link.href ||
                            (link.href !== '/' && pathname?.startsWith(link.href))
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                                <span className="text-[10px] font-bold">{link.label}</span>
                            </Link>
                        )
                    })}

                    {user ? (
                        <Link
                            href="/dashboard"
                            className={cn(
                                'flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all',
                                pathname?.startsWith('/dashboard')
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-bold">{t.common.profile}</span>
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-muted-foreground transition-all hover:text-foreground"
                        >
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-bold">{t.auth.signIn}</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Spacer for bottom bar */}
            <div className="h-[calc(var(--bottom-bar-height)+var(--safe-area-bottom))] lg:hidden" />
        </>
    )
}
