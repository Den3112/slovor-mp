import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
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
  hideLogo?: boolean
}

// --- Component ---

export function UnifiedSidebar({
  config,
  className,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onNavigate,
  hideLogo = false,
}: UnifiedSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  const isActiveLink = (href: string) => {
    const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')

    // Exact match for main dashboard/admin entry points
    if (href === '/dashboard' || href === '/admin') {
      return cleanPathname === href || cleanPathname === href + '/'
    }

    // For sub-pages, ensure we don't match partial paths like /admin/users with /admin
    // unless they are explicitly meant to be sub-items
    return cleanPathname === href || cleanPathname.startsWith(href + '/')
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/`)
    router.refresh()
  }

  return (
    <div
      className={cn(
        'bg-card border-border flex h-full flex-col border-r transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        !isMobile && 'h-full',
        className
      )}
      data-testid="dashboard-sidebar"
    >
      {/* Header / Logo Area */}
      <div
        className={cn(
          'flex items-center px-6 transition-all',
          !hideLogo && 'border-border border-b h-(--header-height) justify-between',
          hideLogo && 'h-10 justify-end',
          isCollapsed && 'justify-center px-0'
        )}
      >
        {!hideLogo && !isCollapsed && <Logo size="sm" />}
        {!hideLogo && isCollapsed && <Logo size="sm" showText={false} />}

        {!isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-muted-foreground/60 hover:text-primary hover:bg-primary/5 h-8 w-8 transition-all"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </Button>
        )}
      </div>

      {/* Scrollable Nav Area */}
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-6">
          {config.sections.map((section, sectionIdx) => (
            <div key={section.title || sectionIdx} className="space-y-1">
              {section.title && !isCollapsed && (
                <h3 className="text-muted-foreground/50 mb-2 px-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((link) => {
                  const Icon = link.icon
                  const active = isActiveLink(link.href)
                  const localePrefix = `/${locale}`
                  const localizedHref =
                    link.href.startsWith('http') ||
                      link.external ||
                      link.href.startsWith(localePrefix)
                      ? link.href
                      : `${localePrefix}${link.href.startsWith('/') ? '' : '/'}${link.href}`

                  return (
                    <Link
                      key={link.href}
                      href={localizedHref}
                      onClick={onNavigate}
                      className={cn(
                        'group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-[11px] font-bold tracking-widest uppercase transition-all',
                        active
                          ? 'bg-primary/10 text-primary shadow-primary/20 shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        isCollapsed && 'justify-center px-0'
                      )}
                      title={isCollapsed ? link.label : undefined}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                          isCollapsed ? 'mx-auto' : ''
                        )}
                      />

                      {!isCollapsed && (
                        <span className="flex-1 truncate">{link.label}</span>
                      )}

                      {/* Counter Badge */}
                      {link.badgeCount !== undefined &&
                        link.badgeCount > 0 &&
                        !isCollapsed && (
                          <span
                            className={cn(
                              'ml-auto rounded-sm border px-2 py-0.5 text-[9px] font-bold transition-colors',
                              active
                                ? 'border-white/30 bg-white/20 text-white'
                                : 'bg-primary/5 text-primary border-primary/10'
                            )}
                          >
                            {link.badgeCount}
                          </span>
                        )}

                      {active && !isCollapsed && (
                        <div className="bg-primary absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-full" />
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
      <div className="border-border bg-card relative z-10 mt-auto shrink-0 border-t p-4">
        <button
          onClick={handleSignOut}
          className={cn(
            'group text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[11px] font-bold tracking-widest uppercase transition-all',
            isCollapsed && 'justify-center px-0'
          )}
          title={config.signOutLabel}
        >
          <LogOut
            className={cn(
              'h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1',
              isCollapsed ? 'mx-auto' : ''
            )}
          />
          {!isCollapsed && <span>{config.signOutLabel}</span>}
        </button>
      </div>
    </div>
  )
}
