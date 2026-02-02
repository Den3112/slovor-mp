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
        if (href === '/dashboard' || href === '/admin') {
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
                'flex flex-col h-full bg-card border-r border-border/60 transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64',
                !isMobile && 'sticky top-0 h-screen',
                className
            )}
            data-testid="dashboard-sidebar"
        >
            {/* Header / Logo Area */}
            <div className={cn(
                "flex items-center h-20 px-6 border-b border-border/40",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && <Logo size="sm" />}
                {isCollapsed && <Logo size="sm" showText={false} />}

                {!isMobile && onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapse}
                        className="h-8 w-8 text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                )}
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
                <nav className="space-y-1.5">
                    {allItems.map((link) => {
                        const Icon = link.icon
                        const active = isActiveLink(link.href)

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onNavigate}
                                className={cn(
                                    'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all relative overflow-hidden',
                                    active
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                                    isCollapsed && 'justify-center px-0'
                                )}
                                title={isCollapsed ? link.label : undefined}
                            >
                                <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isCollapsed ? "mx-auto" : "")} />

                                {!isCollapsed && (
                                    <span className="flex-1 truncate">
                                        {link.label}
                                    </span>
                                )}

                                {/* Counter Badge */}
                                {link.badgeCount !== undefined && link.badgeCount > 0 && !isCollapsed && (
                                    <span className={cn(
                                        "ml-auto text-[9px] font-black px-2 py-0.5 rounded-md border transition-colors",
                                        active ? "bg-white/20 text-white border-white/30" : "bg-primary/10 text-primary border-primary/20"
                                    )}>
                                        {link.badgeCount}
                                    </span>
                                )}

                                {active && !isCollapsed && (
                                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white/40 rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/40 mt-auto bg-muted/5">
                <button
                    onClick={handleSignOut}
                    className={cn(
                        "group flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all",
                        isCollapsed && 'justify-center px-0'
                    )}
                    title={config.signOutLabel}
                >
                    <LogOut className={cn("h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1", isCollapsed ? "mx-auto" : "")} />
                    {!isCollapsed && (
                        <span>{config.signOutLabel}</span>
                    )}
                </button>
            </div>
        </div>
    )
}
