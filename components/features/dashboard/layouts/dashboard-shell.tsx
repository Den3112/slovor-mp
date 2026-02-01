'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UnifiedSidebar, type SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'

interface DashboardShellProps {
    children: React.ReactNode
    config: SidebarConfig
    mobileNav?: React.ReactNode // Optional custom mobile nav (e.g. BottomNav)
    headerContent?: React.ReactNode
}

export function DashboardShell({
    children,
    config,
    mobileNav,
    headerContent,
}: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Prevent hydration mismatch for responsive checks if needed
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null // or a loading skeleton
    }

    return (
        <div className="dashboard-view relative min-h-screen bg-background transition-colors duration-300">

            {/* --- Mobile Header --- */}
            <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
                <div className="flex items-center gap-3">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 border-none bg-transparent shadow-none">
                            <div className="h-full w-full bg-card rounded-r-3xl overflow-hidden shadow-2xl">
                                <UnifiedSidebar
                                    config={config}
                                    isMobile
                                    onNavigate={() => setIsMobileOpen(false)}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Logo size="sm" />
                </div>
                <div className="flex items-center gap-2">
                    {headerContent}
                </div>
            </div>

            <div className="flex h-screen overflow-hidden pt-0 md:pt-0">

                {/* --- Desktop Sidebar --- */}
                <div className="hidden md:flex md:shrink-0 z-30 relative">
                    <UnifiedSidebar
                        config={config}
                        isCollapsed={isCollapsed}
                        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                        className="h-full border-r border-border/50 shadow-sm"
                    />
                </div>

                {/* --- Main Content Area --- */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth focus:outline-none" id="main-content">
                    {/* Header offset for fixed global header */}
                    <div className="hidden h-16 md:block" />

                    <Container className="py-6 min-h-full">
                        {/* Page Header Area */}
                        {(headerContent) && (
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="hidden md:block">
                                    {headerContent}
                                </div>
                            </div>
                        )}

                        {/* Page Content with Transition */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="content-root"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="min-h-[500px]"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>

                        {/* Spacer for bottom nav if exists */}
                        {mobileNav && <div className="h-20 md:hidden" />}
                    </Container>
                </main>
            </div>

            {/* --- Mobile Bottom Nav (Optional Overlay) --- */}
            {mobileNav && (
                <div className="fixed bottom-0 left-0 right-0 z-60 md:hidden">
                    {mobileNav}
                </div>
            )}

        </div>
    )
}
