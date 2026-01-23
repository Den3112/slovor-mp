'use client'

import { Drawer } from 'vaul'
import { Button } from '@/components/ui/button'
import {
    Heart,
    Settings,
    Package,
    LogOut,
    Eye,
    UserCircle,
    MessageCircle,
    ShoppingBag,
    Store,
    Star,
} from 'lucide-react'
import { FlagSK, FlagUS, FlagCZ } from '@/components/ui/flags'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'

import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface NavSection {
    title?: string
    items: {
        href: string
        label: string
        icon: React.ElementType
    }[]
}

// ... imports ...

// Cleaned up implementation
export function MobileMenuDrawer({
    children,
    open,
    setOpenAction,
    stats
}: {
    children: React.ReactNode
    open?: boolean
    setOpenAction?: (open: boolean) => void
    stats?: DashboardStats
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { locale, setLocale } = useTranslation()
    const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const getBadgeCount = (href: string) => {
        if (!stats) return 0
        switch (href) {
            case '/profile/my-listings': return stats.activeListings
            case '/profile/favorites': return stats.favorites
            case '/profile/orders': return stats.orders
            case '/profile/messages': return stats.messages
            case '/profile/reviews': return stats.reviews
            case '/profile/saved-searches': return stats.savedSearches
            default: return 0
        }
    }

    const sections: NavSection[] = [
        {
            title: 'Commerce',
            items: [
                { href: '/profile/my-listings', label: 'My Listings', icon: Store },
                { href: '/profile/orders', label: 'Orders', icon: Package },
                { href: '/profile/wallet', label: 'Wallet', icon: ShoppingBag },
            ]
        },
        {
            title: 'Shopping',
            items: [
                { href: '/profile/purchases', label: 'History', icon: ShoppingBag },
                { href: '/profile/favorites', label: 'Favorites', icon: Heart },
                { href: '/profile/saved-searches', label: 'Saved Searches', icon: Star },
            ]
        },
        {
            title: 'Communication',
            items: [
                { href: '/profile/messages', label: 'Inbox', icon: MessageCircle },
                { href: '/profile/reviews', label: 'Reviews', icon: Star },
            ]
        },
        {
            title: 'Account',
            items: [
                { href: '/profile/profile', label: 'Public Profile', icon: Eye },
                { href: '/profile/settings', label: 'Settings', icon: Settings },
            ]
        }
    ]

    return (
        <Drawer.Root open={open} onOpenChange={setOpenAction}>
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content
                    className="bg-background flex flex-col rounded-t-[2rem] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none"
                    aria-describedby={undefined}
                >

                    {/* Handle Indicator */}
                    <div className="p-4 bg-background rounded-t-[2rem] flex-shrink-0">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mb-8" />
                        <Drawer.Title className="sr-only">Mobile Menu</Drawer.Title>
                        <Drawer.Description className="sr-only">
                            Navigation menu for accessing different sections of the dashboard.
                        </Drawer.Description>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 pt-0">
                        {/* User Header */}
                        {user && (
                            <div className="flex items-center gap-4 mb-8 bg-muted/40 p-4 rounded-2xl border border-white/5">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <UserCircle className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-lg truncate">
                                        {user.user_metadata?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate font-mono">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Grid */}
                        <div className="space-y-6 pb-20">
                            {sections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="px-2 mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                                        {section.title}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {section.items.map((item) => {
                                            const Icon = item.icon
                                            const isActive = pathname.startsWith(item.href)
                                            const count = getBadgeCount(item.href)

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setOpenAction?.(false)}
                                                    className={cn(
                                                        "flex flex-col gap-2 p-4 rounded-2xl border transition-all active:scale-95 relative overflow-hidden",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                                            : "bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <Icon className="h-6 w-6" />
                                                        {count > 0 && (
                                                            <span className={cn(
                                                                "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black",
                                                                isActive
                                                                    ? "bg-white text-primary"
                                                                    : "bg-primary text-white"
                                                            )}>
                                                                {count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-sm">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Language Selector */}
                            <div className="mb-6">
                                <h3 className="px-2 mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                                    Language
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {SUPPORTED_LOCALES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLocale(lang.code as 'sk' | 'en' | 'cs')
                                                setOpenAction?.(false)
                                            }}
                                            className={cn(
                                                'flex flex-col items-center gap-2 rounded-2xl border py-4 font-bold transition-all active:scale-95',
                                                locale === lang.code
                                                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                    : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted'
                                            )}
                                        >
                                            <div className="flex h-6 w-9 items-center justify-center overflow-hidden rounded-sm shadow-sm">
                                                <div className="h-full w-full scale-125 transform saturate-[1.2]">
                                                    {lang.flag}
                                                </div>
                                            </div>
                                            <span className="text-xs">{lang.code.toUpperCase()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-border/50 pt-6">
                                <Button
                                    variant="destructive"
                                    className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-destructive/10"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

const SUPPORTED_LOCALES = [
    { code: 'en', name: 'English', flag: <FlagUS className="h-full w-full object-cover" /> },
    { code: 'sk', name: 'Slovenčina', flag: <FlagSK className="h-full w-full object-cover" /> },
    { code: 'cs', name: 'Čeština', flag: <FlagCZ className="h-full w-full object-cover" /> },
]
