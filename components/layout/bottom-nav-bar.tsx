'use client'

import Link from 'next/link'
import { User, Plus } from 'lucide-react'
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

    // Split links: First 2 go left, rest go right (before the profile)
    // NOTE: We assume navLinks has enough items. If not, the layout might look sparse but won't break.
    const leftLinks = navLinks.slice(0, 2)
    const rightLinks = navLinks.slice(2)

    const isActive = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(href))

    // Don't render the public bottom nav on dashboard pages (Dashboard has its own nav)
    if (pathname?.startsWith('/profile')) {
        return null
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            {/* Glassmorphism Background with Gradient Border Top */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]" />

            <nav className="relative h-[88px] pb-[28px] px-2 flex items-center justify-around">
                {/* Left Links (Home, Listings) */}
                {leftLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
                            isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <link.icon className={cn("h-6 w-6", isActive(link.href) && "fill-primary/20")} />
                        <span className="text-[10px] font-bold whitespace-nowrap">{link.label}</span>
                    </Link>
                ))}

                {/* CORE ACTION: POST AD (+) */}
                <div className="relative -top-6">
                    <Link href="/post">
                        <div className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-white active:scale-95 transition-transform border-[3px] border-background">
                            <Plus className="h-7 w-7 stroke-[3]" />
                        </div>
                    </Link>
                </div>

                {/* Right Links (Categories) */}
                {rightLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
                            isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <link.icon className={cn("h-6 w-6", isActive(link.href) && "fill-primary/20")} />
                        <span className="text-[10px] font-bold whitespace-nowrap">{link.label}</span>
                    </Link>
                ))}

                {/* Profile / Login */}
                {user ? (
                    <Link
                        href="/profile"
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
                            pathname?.startsWith('/profile') ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <User className={cn("h-6 w-6", pathname?.startsWith('/profile') && "fill-primary/20")} />
                        <span className="text-[10px] font-bold whitespace-nowrap">{t.common.profile}</span>
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95 text-muted-foreground hover:text-foreground"
                    >
                        <User className="h-6 w-6" />
                        <span className="text-[10px] font-bold whitespace-nowrap">{t.auth.signIn}</span>
                    </Link>
                )}
            </nav>
        </div>
    )
}
