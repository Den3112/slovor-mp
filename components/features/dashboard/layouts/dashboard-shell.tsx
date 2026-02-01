'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UnifiedSidebar, type SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

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
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-card">
                <UnifiedSidebar
                    config={config}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar for Mobile + Title */}
                <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
                    <div className="md:hidden">
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0 border-r border-border">
                                <UnifiedSidebar
                                    config={config}
                                    isMobile
                                    onNavigate={() => setIsMobileOpen(false)}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-4">
                        {title && <h1 className="text-xl font-bold font-heading">{title}</h1>}
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {headerContent}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
