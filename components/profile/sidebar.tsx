'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import {
    LayoutDashboard,
    Heart,
    Settings,
    Package,
    LogOut,
    Eye,
    MessageCircle,
    ShoppingBag,
    Store,
    Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
    href: string
    label: string
    icon: React.ElementType
    external?: boolean
}

interface NavSection {
    title?: string
    items: NavItem[]
}

import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface DashboardSidebarProps {
    stats?: DashboardStats
}

export function DashboardSidebar({ stats }: DashboardSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    // Map stats to routes
    const getBadgeCount = (href: string) => {
        if (!stats) return 0
        switch (href) {
            case '/profile/my-listings': return stats.activeListings
            case '/profile/favorites': return stats.favorites
            case '/profile/orders': return stats.orders
            case '/profile/messages': return stats.messages
            case '/profile/saved-searches': return stats.savedSearches
            case '/profile/reviews': return stats.reviews
            default: return 0
        }
    }

    /* Premium Marketplace Sidebar Structure */
    const sections: NavSection[] = [
        {
            title: 'Overview', // Optional title for first section
            items: [
                {
                    href: '/profile/overview',
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                },
            ]
        },
        {
            title: 'Commerce',
            items: [
                {
                    href: '/profile/my-listings',
                    label: 'My Listings',
                    icon: Store, // Changed to Store for "My Shop" feel
                },
                {
                    href: '/profile/orders',
                    label: 'Orders',
                    icon: Package,
                },
                {
                    href: '/profile/wallet',
                    label: 'Wallet',
                    icon: ShoppingBag, // Temporary, maybe use Wallet icon if available or DollarSign
                },
            ]
        },
        {
            title: 'Shopping',
            items: [
                {
                    href: '/profile/purchases',
                    label: 'Purchases',
                    icon: ShoppingBag,
                },
                {
                    href: '/profile/favorites',
                    label: 'Favorites',
                    icon: Heart,
                },
                {
                    href: '/profile/saved-searches',
                    label: 'Saved Searches',
                    icon: Star,
                },
            ]
        },
        {
            title: 'Communication',
            items: [
                {
                    href: '/profile/messages',
                    label: 'Inbox',
                    icon: MessageCircle,
                },
                {
                    href: '/profile/reviews',
                    label: 'Reviews',
                    icon: Star, // Need to import Star
                },
            ]
        },
        {
            title: 'Account',
            items: [
                {
                    href: '/profile/profile',
                    label: 'Public Profile',
                    icon: Eye,
                },
                {
                    href: '/profile/settings',
                    label: 'Settings',
                    icon: Settings,
                }
            ]
        }
    ]

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const isActiveLink = (href: string) => {
        if (href === '/profile/overview') return pathname === href
        return pathname.startsWith(href)
    }

    return (
        <>
            {/* Mobile Nav is now handled by MobileBottomNav component */}

            {/* Desktop: Full sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
                <div className="rounded-[2.5rem] bg-background/60 backdrop-blur-xl p-6 shadow-2xl border border-white/20 dark:border-white/5 sticky top-28 overflow-hidden group/sidebar">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                {section.title && (
                                    <h3 className="px-4 mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        {section.title}
                                    </h3>
                                )}
                                <nav className="space-y-1.5">
                                    {section.items.map((link) => {
                                        const Icon = link.icon
                                        const active = isActiveLink(link.href)
                                        const count = getBadgeCount(link.href)

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 group relative overflow-hidden',
                                                    active
                                                        ? 'text-primary-foreground shadow-lg shadow-primary/20'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                                )}
                                            >
                                                {active && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90" />
                                                )}
                                                <Icon className={cn("relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                                <span className="relative z-10 flex-1">{link.label}</span>

                                                {/* Counter Badge */}
                                                {count > 0 && (
                                                    <span className={cn(
                                                        "relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black min-w-[20px] text-center",
                                                        active
                                                            ? "bg-white/20 text-white"
                                                            : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                                    )}>
                                                        {count}
                                                    </span>
                                                )}

                                                {/* Active Indicator Dot (Only if no badge or specific design choice) */}
                                                {active && !count && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                )}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>

                    <div className="my-6 border-t border-border/20" />

                    <button
                        onClick={handleSignOut}
                        className="relative z-10 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    )
}
