'use client'

import { useState } from 'react'
import { Menu, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UnifiedSidebar, type SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface DashboardShellProps {
    children: React.ReactNode
    config: SidebarConfig
    headerContent?: React.ReactNode
    title?: string
}

export function DashboardShell({
    children,
    config,
    headerContent,
    title,
}: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-background/50">
            {/* Sidebar - Desktop */}
            <aside className={cn(
                "hidden md:flex shrink-0 transition-all duration-300 ease-in-out border-r border-border/60 bg-card",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <UnifiedSidebar
                    config={config}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Bar - Glassmorphism */}
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="md:hidden">
                            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted/80">
                                        <Menu className="h-5 w-5 text-muted-foreground" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-0 border-r border-border/80">
                                    <UnifiedSidebar
                                        config={config}
                                        isMobile
                                        onNavigate={() => setIsMobileOpen(false)}
                                    />
                                </SheetContent>
                            </Sheet>
                        </div>

                        {title ? (
                            <h1 className="text-sm font-black uppercase tracking-tight text-foreground/90 flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4 text-primary opacity-50" />
                                {title}
                            </h1>
                        ) : (
                            <div className="h-4 w-32 bg-muted/40 animate-pulse rounded" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            {headerContent}
                        </div>
                        <div className="h-8 w-px bg-border/40 mx-2 hidden sm:block" />
                        <ThemeToggle />
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-muted/5 scrollbar-hide">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
