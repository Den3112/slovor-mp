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
                'flex flex-col h-full bg-[#1E293B] border-r border-[#334155] transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64',
                !isMobile && 'sticky top-0 h-screen',
                className
            )}
            data-testid="dashboard-sidebar"
        >
            {/* Header / Logo Area */}
            <div className={cn(
                "flex items-center h-[80px] px-6 border-b border-[#334155]",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && <Logo size="sm" variant="white" />}
                {isCollapsed && <Logo size="sm" showText={false} variant="white" />}

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
                <nav className="space-y-6">
                    {config.sections.map((section, sectionIdx) => (
                        <div key={section.title || sectionIdx} className="space-y-1">
                            {section.title && !isCollapsed && (
                                <h3 className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {section.items.map((link) => {
                                    const Icon = link.icon
                                    const active = isActiveLink(link.href)

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={onNavigate}
                                            className={cn(
                                                'group flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all relative overflow-hidden',
                                                active
                                                    ? 'bg-primary/10 text-white shadow-primary/20'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
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
                                                    "ml-auto text-[9px] font-bold px-2 py-0.5 rounded-sm border transition-colors",
                                                    active ? "bg-white/20 text-white border-white/30" : "bg-primary/5 text-primary border-primary/10"
                                                )}>
                                                    {link.badgeCount}
                                                </span>
                                            )}

                                            {active && !isCollapsed && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-full" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border mt-auto bg-muted/5">
                <button
                    onClick={handleSignOut}
                    className={cn(
                        "group flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-all",
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
