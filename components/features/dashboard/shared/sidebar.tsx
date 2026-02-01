import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LogOut, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/logo'

// --- Types ---

export interface NavItem {
    href: string
    label: string
    icon: LucideIcon
    badgeCount?: number
    external?: boolean
}

export interface SidebarConfig {
    items: NavItem[]
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

    const allItems = config.items

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
        <div
            className={cn(
                'flex flex-col h-full bg-card border-r border-border',
                isCollapsed ? 'w-20' : 'w-64',
                !isMobile && 'sticky top-0 h-screen',
                className
            )}
            data-testid="dashboard-sidebar"
        >
            {/* Header / Logo Area */}
            <div className={cn(
                "flex items-center h-16 px-4 border-b border-border",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && <Logo size="sm" />}
                {isCollapsed && <Logo size="sm" showText={false} />}

                {!isMobile && onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapse}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                )}
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
                <nav className="space-y-1">
                    {allItems.map((link) => {
                        const Icon = link.icon
                        const active = isActiveLink(link.href)

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onNavigate}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                    isCollapsed && 'justify-center px-2'
                                )}
                                title={isCollapsed ? link.label : undefined}
                            >
                                <Icon className={cn("h-5 w-5 shrink-0", isCollapsed ? "mr-0" : "mr-3")} />

                                {!isCollapsed && (
                                    <span className="flex-1 truncate">
                                        {link.label}
                                    </span>
                                )}

                                {/* Counter Badge */}
                                {link.badgeCount !== undefined && link.badgeCount > 0 && !isCollapsed && (
                                    <span className="ml-auto bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {link.badgeCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border mt-auto">
                <button
                    onClick={handleSignOut}
                    className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
                        isCollapsed && 'justify-center px-2'
                    )}
                    title={config.signOutLabel}
                >
                    <LogOut className={cn("h-5 w-5 shrink-0", isCollapsed ? "mr-0" : "mr-3")} />
                    {!isCollapsed && (
                        <span>{config.signOutLabel}</span>
                    )}
                </button>
            </div>
        </div>
    )
}
