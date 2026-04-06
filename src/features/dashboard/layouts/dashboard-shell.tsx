'use client'

import { useState } from 'react'
import { Menu, LayoutDashboard } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet'
import {
  UnifiedSidebar,
  type SidebarConfig,
} from '@/features/dashboard/shared/sidebar'

import { cn } from '@/shared/lib/utils'
import { PullToRefresh } from '@/shared/ui/pull-to-refresh'
import { Container } from '@/shared/ui/container'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

interface DashboardShellProps {
  children: React.ReactNode
  config: SidebarConfig
  headerContent?: React.ReactNode
  title?: string
  showBreadcrumbs?: boolean
}

export function DashboardShell({
  children,
  config,
  headerContent,
  title,
  showBreadcrumbs = true,
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))]">
      <Container className="flex flex-1 items-start gap-0 p-0 sm:px-6 lg:px-8">
        {/* Sidebar - Desktop - Sticky under the 80px main Header */}
        <aside
          className={cn(
            'glass-panel border-primary/5 ease-out-expo sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] shrink-0 border-r transition-all duration-500 lg:flex',
            isCollapsed ? 'w-20' : 'w-72'
          )}
        >
          <UnifiedSidebar
            config={config}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            hideLogo={true}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex min-h-[calc(100vh-var(--header-height))] min-w-0 flex-1 flex-col">
          {/* Secondary Page Header - Integrated into page flow */}
          {(title || headerContent) && (
            <div className="glass-panel border-primary/10 shadow-primary/5 mx-6 mt-6 flex h-16 shrink-0 items-center justify-between rounded-2xl border px-8 py-2 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="lg:hidden">
                  <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/5 h-10 w-10 rounded-2xl transition-all active:scale-90"
                        data-testid="mobile-sidebar-trigger"
                      >
                        <Menu className="text-primary/60 h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="border-primary/10 w-72 border-r p-0"
                    >
                      <UnifiedSidebar
                        config={config}
                        isMobile
                        hideLogo={true}
                        onNavigate={() => setIsMobileOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {showBreadcrumbs ? (
                  <Breadcrumbs />
                ) : (
                  title && (
                    <h1 className="text-muted-foreground/90 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                      <LayoutDashboard className="text-primary h-3 w-3 opacity-50" />
                      {title}
                    </h1>
                  )
                )}
              </div>

              <div className="flex items-center gap-4">{headerContent}</div>
            </div>
          )}

          {/* Content */}
          <div className="scrollbar-hide flex-1 p-4 sm:p-6 lg:p-8">
            <PullToRefresh>
              <div className="animate-in fade-in slide-in-from-bottom-2 mx-auto mt-2 max-w-7xl space-y-8 duration-500">
                {children}
              </div>
            </PullToRefresh>
          </div>
        </div>
      </Container>
    </div>
  )
}
