'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

export function BottomTabBar() {
    const { t, locale } = useTranslation(['common', 'nav'])
    const { user } = useAuth()
    const pathname = usePathname()
    const unreadCount = useUnreadMessages()
    const isDashboard = pathname?.includes('/admin') || pathname?.includes('/dashboard') || pathname?.includes('/messages') || pathname?.includes('/favorites')

    if (isDashboard) {
        return null
    }

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === `/${locale}`
        }
        return pathname?.startsWith(`/${locale}${href}`)
    }

    const tabs = [
        { icon: Home, label: t('nav:home'), href: '/' },
        { icon: Search, label: t('nav:search'), href: '/search' },
        { icon: Plus, label: t('nav:postAd'), href: '/post', primary: true },
        { icon: Heart, label: t('nav:favorites'), href: '/favorites' },
        { icon: User, label: user ? t('nav:dashboard') : t('common:signIn'), href: user ? '/dashboard' : '/auth/login' },
    ]

    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 h-16 border-t border-border bg-background pb-safe md:hidden print:hidden">
            <div className="flex h-full items-center justify-around px-2">
                {tabs.map((tab) => {
                    const active = isActive(tab.href)
                    const Icon = tab.icon

                    return (
                        <Link
                            key={tab.href}
                            href={`/${locale}${tab.href}`}
                            className={cn(
                                "relative flex flex-col items-center justify-center flex-1 py-2 gap-1",
                                "text-muted-foreground hover:text-foreground transition-colors",
                                active ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {tab.primary ? (
                                <div className="relative -mt-8 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                                    <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 ring-4 ring-background transition-all active:scale-90 group-hover:scale-110 border-0">
                                        <Icon className="h-7 w-7" strokeWidth={3} />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Icon className={cn("h-5 w-5 transition-all", active && "scale-110")} strokeWidth={active ? 2.5 : 2} />
                                    {tab.href === (user ? '/dashboard' : '/auth/login') && unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-lg bg-primary text-[9px] font-bold text-white ring-2 ring-background shadow-sm">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                            )}
                            <span className={cn("text-[10px] font-medium truncate w-full text-center px-1", active && "font-bold")}>
                                {tab.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
