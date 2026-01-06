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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'

interface NavSection {
    title?: string
    items: {
        href: string
        label: string
        icon: React.ElementType
    }[]
}

export function MobileMenuDrawer({
    children,
    open,
    onOpenChange
}: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
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

    const sections: NavSection[] = [
        {
            title: 'Commerce',
            items: [
                { href: '/dashboard/listings', label: 'My Listings', icon: Store },
                { href: '/dashboard/orders', label: 'Orders', icon: Package },
                { href: '/dashboard/wallet', label: 'Wallet', icon: ShoppingBag },
            ]
        },
        {
            title: 'Shopping',
            items: [
                { href: '/dashboard/purchases', label: 'History', icon: ShoppingBag },
                { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
            ]
        },
        {
            title: 'Communication',
            items: [
                { href: '/dashboard/messages', label: 'Inbox', icon: MessageCircle },
                { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
            ]
        },
        {
            title: 'Account',
            items: [
                { href: '/dashboard/profile', label: 'Public Profile', icon: Eye },
                { href: '/dashboard/settings', label: 'Settings', icon: Settings },
            ]
        }
    ]

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
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
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => onOpenChange?.(false)}
                                                    className={cn(
                                                        "flex flex-col gap-2 p-4 rounded-2xl border transition-all active:scale-95",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                                            : "bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <Icon className="h-6 w-6" />
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
                                                onOpenChange?.(false)
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

const FlagSK = () => (
    <svg viewBox="0 0 640 480" className="h-full w-full object-cover">
        <path fill="#ffffff" d="M0 0h640v480H0z" />
        <path fill="#ffffff" d="M0 160h640v320H0z" />
        <path fill="#0b4ea2" d="M0 160h640v160H0z" />
        <path fill="#ee1c25" d="M0 320h640v160H0z" />
        <path
            fill="#ffffff"
            d="M190 200c0 40-10 80-50 80-40 0-50-40-50-80h100z"
            transform="translate(40)"
        />
        <path
            fill="#0b4ea2"
            d="M185 205c0 30-5 60-35 60-30 0-35-30-35-60h70z"
            transform="translate(40)"
        />
        <path
            fill="#ee1c25"
            d="M165 240l10 20 10-20h-20z"
            transform="translate(40)"
        />
    </svg>
)

const FlagUS = () => (
    <svg viewBox="0 0 640 480" className="h-full w-full object-cover">
        <path fill="#bd3d44" d="M0 0h640v480H0" />
        <path
            stroke="#fff"
            strokeWidth="37"
            d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
        />
        <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
        <marker id="us-star" markerWidth="30" markerHeight="30" viewBox="0 0 18 18">
            <path fill="#fff" d="M9 0l3 6 6 .8-4 5 1 7-6-3-6 3 1-7-4-5 6-.8z" />
        </marker>
    </svg>
)

const FlagCZ = () => (
    <svg viewBox="0 0 640 480" className="h-full w-full object-cover">
        <path fill="#ffffff" d="M0 0h640v240H0z" />
        <path fill="#d7141a" d="M0 240h640v240H0z" />
        <path fill="#11457e" d="M0 0l360 240L0 480z" />
    </svg>
)

const SUPPORTED_LOCALES = [
    { code: 'en', name: 'English', flag: <FlagUS /> },
    { code: 'sk', name: 'Slovenčina', flag: <FlagSK /> },
    { code: 'cs', name: 'Čeština', flag: <FlagCZ /> },
]
