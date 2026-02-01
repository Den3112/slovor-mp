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
    onNavigate?: () => void
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

    const isActiveLink = (href: string) => {
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
                'relative bg-card transition-all duration-300 ease-out',
                isCollapsed ? 'w-[72px]' : 'w-64',
                isMobile ? 'w-full h-full' : 'h-screen sticky top-0 border-r border-border',
                className
            )}
            data-testid="dashboard-sidebar"
        >
            <div className="flex flex-col h-full">
                {/* Header / Logo Area */}
                <div className={cn(
                    "flex items-center h-16 px-4 border-b border-border",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    {!isCollapsed && (
                        <Logo size="sm" />
                    )}
                    {isCollapsed && (
                        <Logo size="sm" showText={false} />
                    )}
                    {!isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollapse}
                            className="h-8 w-8 hover:bg-muted text-muted-foreground"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </Button>
                    )}
                </div>

                {/* Scrollable Nav Area */}
                <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    <div className="space-y-6 px-3">
                        {config.sections.map((section, idx) => (
                            <div key={idx}>
                                {/* Section Title */}
                                {section.title && !isCollapsed && (
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                                    >
                                        {section.title}
                                    </motion.h3>
                                )}
                                {/* Collapsed separator */}
                                {section.title && isCollapsed && idx > 0 && (
                                    <div className="h-px bg-border my-3 mx-2" />
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
                                                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                                    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                                    active
                                                        ? 'bg-primary text-primary-foreground font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                                    isCollapsed && 'justify-center px-2'
                                                )}
                                                title={isCollapsed ? link.label : undefined}
                                            >
                                                <Icon
                                                    className={cn(
                                                        'h-5 w-5 shrink-0 transition-colors',
                                                        active && 'text-primary-foreground'
                                                    )}
                                                />

                                                {!isCollapsed && (
                                                    <span className="flex-1 truncate">
                                                        {link.label}
                                                    </span>
                                                )}

                                                {/* Counter Badge */}
                                                {link.badgeCount !== undefined && link.badgeCount > 0 && !isCollapsed && (
                                                    <span
                                                        className={cn(
                                                            'min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold',
                                                            active
                                                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                                                : 'bg-primary/10 text-primary'
                                                        )}
                                                    >
                                                        {link.badgeCount}
                                                    </span>
                                                )}

                                                {/* Dot indicator for collapsed state */}
                                                {isCollapsed && link.badgeCount !== undefined && link.badgeCount > 0 && (
                                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                                                )}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border">
                    {/* Language Switcher */}
                    <div className="mb-3">
                        <LanguageSwitcher isCollapsed={isCollapsed} />
                    </div>

                    {/* Role Switcher */}
                    {user?.user_metadata?.role === 'admin' && (
                        <div className="mb-3">
                            {!isCollapsed ? (
                                <Link href={pathname.includes('/admin') ? '/profile/overview' : '/admin'} className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-3 rounded-lg text-sm font-medium"
                                    >
                                        {pathname.includes('/admin') ? (
                                            <>
                                                <UserCircle className="h-4 w-4 shrink-0 text-primary" />
                                                <span>{t('switchToProfile', 'Profile')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <LayoutDashboard className="h-4 w-4 shrink-0 text-primary" />
                                                <span>{t('switchToAdmin', 'Admin')}</span>
                                            </>
                                        )}
                                    </Button>
                                </Link>
                            ) : (
                                <Link
                                    href={pathname.includes('/admin') ? '/profile/overview' : '/admin'}
                                    title={pathname.includes('/admin') ? 'Profile' : 'Admin'}
                                    className="flex justify-center"
                                >
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary/10">
                                        {pathname.includes('/admin') ? <UserCircle size={18} /> : <LayoutDashboard size={18} />}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className={cn(
                            "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                            "text-destructive hover:bg-destructive/10 transition-colors",
                            isCollapsed && 'justify-center px-2'
                        )}
                        title={config.signOutLabel}
                    >
                        <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
                        {!isCollapsed && (
                            <span>{config.signOutLabel}</span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    )
}
