'use client'

import { useState } from 'react'
import { Menu, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  UnifiedSidebar,
  type SidebarConfig,
} from '@/components/features/dashboard/shared/sidebar'

import { cn } from '@/lib/utils'
import { PullToRefresh } from '@/components/ui/pull-to-refresh'
import { Container } from '@/components/ui/container'

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
    <div className="flex min-h-[calc(100vh-var(--header-height))]">
      <Container className="flex flex-1 items-start gap-0 p-0 sm:px-6 lg:px-8">
        {/* Sidebar - Desktop - Sticky under the 80px main Header */}
        <aside
          className={cn(
            'border-border/60 bg-card sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] shrink-0 border-r transition-all duration-300 ease-in-out md:flex',
            isCollapsed ? 'w-20' : 'w-64'
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
            <div className="border-border/60 bg-background mx-4 mt-4 flex h-12 shrink-0 items-center justify-between rounded-xl border px-6 py-2 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="md:hidden">
                  <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-muted/80 h-8 w-8 rounded-lg"
                      >
                        <Menu className="text-muted-foreground h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="border-border/80 w-72 border-r p-0"
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

                {title && (
                  <h1 className="text-muted-foreground/90 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <LayoutDashboard className="text-primary h-3 w-3 opacity-50" />
                    {title}
                  </h1>
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
