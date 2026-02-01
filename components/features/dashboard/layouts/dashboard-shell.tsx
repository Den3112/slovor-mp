'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { UnifiedSidebar, type SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface DashboardShellProps {
    children: React.ReactNode
    config: SidebarConfig
    mobileNav?: React.ReactNode
    headerContent?: React.ReactNode
    title?: string
}

export function DashboardShell({
    children,
    config,
    mobileNav,
    headerContent,
    title,
}: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="dashboard-view min-h-screen bg-background">
            <div className="flex">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <UnifiedSidebar
                        config={config}
                        isCollapsed={isCollapsed}
                        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Mobile Header */}
                    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4 md:hidden">
                        <div className="flex items-center gap-3">
                            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-0 border-r border-border">
                                    <SheetClose className="absolute right-4 top-4 z-50">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </SheetClose>
                                    <UnifiedSidebar
                                        config={config}
                                        isMobile
                                        onNavigate={() => setIsMobileOpen(false)}
                                    />
                                </SheetContent>
                            </Sheet>
                            <Logo size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            {headerContent}
                        </div>
                    </header>

                    {/* Desktop Header (Optional) */}
                    {(title || headerContent) && (
                        <header className="hidden md:flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
                            <div className="flex items-center gap-4">
                                {title && (
                                    <h1 className="text-xl font-semibold text-foreground">
                                        {title}
                                    </h1>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                {headerContent}
                            </div>
                        </header>
                    )}

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="dashboard-content"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                >
                                    {children}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Bottom padding for mobile nav */}
                        {mobileNav && <div className="h-20 md:hidden" />}
                    </main>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            {mobileNav && (
                <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                    {mobileNav}
                </div>
            )}
        </div>
    )
}
