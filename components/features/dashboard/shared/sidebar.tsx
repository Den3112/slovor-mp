'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LogOut, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './language-switcher'
import { useAuth } from '@/components/providers/auth-provider'
import { LayoutDashboard, UserCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

// --- Types ---

export interface NavItem {
    href: string
    label: string
    icon: LucideIcon
    badgeCount?: number
    external?: boolean
}

export interface NavSection {
    title?: string
    items: NavItem[]
}

export interface SidebarConfig {
    sections: NavSection[]
    signOutLabel: string
}

interface UnifiedSidebarProps {
    config: SidebarConfig
    className?: string
    isCollapsed?: boolean
    onToggleCollapse?: () => void
    isMobile?: boolean
    onNavigate?: () => void // Called when link is clicked (e.g. to close drawer)
}

// --- Component ---

export function UnifiedSidebar({
    config,
    className,
    isCollapsed = false,
    onToggleCollapse,
    isMobile = false,
    onNavigate,
}: UnifiedSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()
    const { t } = useTranslation(['common'])
    // We use useTranslation but fallback to props if needed, generic usage
    // The specific translation keys come from the parent configuration

    const isActiveLink = (href: string) => {
        // Standard cleaning of locale prefix
        const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
        if (href === '/profile/overview' || href === '/admin') {
            return cleanPathname === href || cleanPathname === href + '/'
        }
        return cleanPathname.startsWith(href)
    }

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <aside
            className={cn(
                'relative bg-card border-r border-border transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-20' : 'w-72',
                isMobile ? 'w-full h-full border-none shadow-none' : 'h-[calc(100vh-64px)] sticky top-16',
                className
            )}
            data-testid="dashboard-sidebar"
        >
            <div className="flex flex-col h-full rounded-none md:rounded-r-3xl overflow-hidden">
                {/* Header / Logo Area */}
                {!isMobile && (
                    <div className={cn(
                        "flex items-center p-4 mb-2",
                        isCollapsed ? "flex-col gap-4 justify-center" : "justify-between"
                    )}>
                        {!isCollapsed && (
                            <Logo size="sm" className="hidden md:flex" />
                        )}
                        {isCollapsed && (
                            <Logo size="sm" showText={false} className="hidden md:flex" />
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollapse}
                            className="hover:bg-muted text-muted-foreground"
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </Button>
                    </div>
                )}

                {/* Scrollable Nav Area */}
                <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
                    <div className="space-y-6">
                        {config.sections.map((section, idx) => (
                            <div key={idx}>
                                {section.title && !isCollapsed && (
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 font-heading"
                                    >
                                        {section.title}
                                    </motion.h3>
                                )}
                                {/* collapsed separator */}
                                {section.title && isCollapsed && (
                                    <div className="h-px bg-border my-4 mx-2" />
                                )}

                                <nav className="space-y-1">
                                    {section.items.map((link) => {
                                        const Icon = link.icon
                                        const active = isActiveLink(link.href)

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={onNavigate}
                                                className={cn(
                                                    'group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
                                                    active
                                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                                                    isCollapsed ? 'justify-center' : ''
                                                )}
                                                title={isCollapsed ? link.label : undefined}
                                            >
                                                {/* Active Background Animation Layer (Optional if we want cooler effect) */}

                                                <Icon
                                                    className={cn(
                                                        'relative z-10 h-5 w-5 shrink-0 transition-transform duration-300',
                                                        !active && 'group-hover:scale-110',
                                                        active && 'text-primary-foreground'
                                                    )}
                                                />

                                                {!isCollapsed && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="relative z-10 flex-1 truncate font-heading font-bold"
                                                    >
                                                        {link.label}
                                                    </motion.span>
                                                )}

                                                {/* Counter Badge */}
                                                {link.badgeCount !== undefined && link.badgeCount > 0 && !isCollapsed && (
                                                    <span
                                                        className={cn(
                                                            'relative z-10 min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-black',
                                                            active
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                                                        )}
                                                    >
                                                        {link.badgeCount}
                                                    </span>
                                                )}

                                                {/* Dot indicator for collapsed state if has badge */}
                                                {isCollapsed && link.badgeCount !== undefined && link.badgeCount > 0 && (
                                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                                                )}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer and SignOut */}
                <div className="p-4 border-t border-border/50 bg-background/50">
                    <div className="flex flex-col gap-3 mb-4">
                        {/* Language Switcher */}
                        <LanguageSwitcher isCollapsed={isCollapsed} />

                        {/* Role Switcher */}
                        {!isCollapsed && user?.user_metadata?.role === 'admin' && (
                            <Link href={pathname.includes('/admin') ? '/profile/overview' : '/admin'} className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 rounded-xl border-border hover:bg-muted font-bold"
                                >
                                    {pathname.includes('/admin') ? (
                                        <>
                                            <UserCircle className="h-4 w-4 shrink-0 text-primary" />
                                            <span className="text-primary">{t('switchToProfile', 'Switch to Profile')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <LayoutDashboard className="h-4 w-4 shrink-0 text-primary" />
                                            <span className="text-primary">{t('switchToAdmin', 'Switch to Admin')}</span>
                                        </>
                                    )}
                                </Button>
                            </Link>
                        )}
                        {/* Compact Role Switcher for Collapsed State */}
                        {isCollapsed && user?.user_metadata?.role === 'admin' && (
                            <Link href={pathname.includes('/admin') ? '/profile/overview' : '/admin'} title={pathname.includes('/admin') ? 'Switch to Profile' : 'Switch to Admin'}>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 text-primary">
                                    {pathname.includes('/admin') ? <UserCircle size={18} /> : <LayoutDashboard size={18} />}
                                </Button>
                            </Link>
                        )}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className={cn(
                            "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all",
                            isCollapsed ? 'justify-center' : ''
                        )}
                        title={config.signOutLabel}
                    >
                        <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {config.signOutLabel}
                            </motion.span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    )
}
