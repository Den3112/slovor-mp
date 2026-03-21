'use client'
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
import { useMounted } from '@/lib/hooks/use-mounted'

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

import { motion } from 'framer-motion'

// ... (types remains same)

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
  const lang = (params?.lang as string) || 'en'
  const isMounted = useMounted()

  const isActiveLink = (href: string) => {
    const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    if (href === '/dashboard' || href === '/admin') {
      return cleanPathname === href || cleanPathname === href + '/'
    }
    return cleanPathname === href || cleanPathname.startsWith(href + '/')
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${lang}/`)
    router.refresh()
  }

  if (!isMounted)
    return (
      <div
        className={cn(
          'bg-card border-border border-r',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      />
    )

  return (
    <div
      className={cn(
        'bg-card border-border ease-out-expo flex h-full flex-col border-r transition-all duration-500',
        isCollapsed ? 'w-20' : 'w-72',
        !isMobile && 'h-full',
        className
      )}
      data-testid="dashboard-sidebar"
    >
      {/* Header / Logo Area */}
      <div
        className={cn(
          'flex items-center px-8 transition-all',
          !hideLogo &&
            'border-border h-(--header-height) justify-between border-b',
          hideLogo && 'h-16 justify-end',
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
            className="text-primary/40 hover:text-primary hover:bg-primary/5 h-9 w-9 rounded-xl transition-all active:scale-90"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        )}
      </div>

      {/* Scrollable Nav Area */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-8">
        <nav className="space-y-10">
          {config.sections.map((section, sectionIdx) => (
            <div key={section.title || sectionIdx} className="space-y-4">
              {section.title && !isCollapsed && (
                <h3 className="text-primary/40 px-5 text-[10px] font-black tracking-[0.3em] uppercase">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1.5">
                {section.items.map((link) => {
                  const Icon = link.icon
                  const active = isActiveLink(link.href)
                  const langPrefix = `/${lang}`
                  const localizedHref =
                    link.href.startsWith('http') ||
                    link.external ||
                    link.href.startsWith(langPrefix)
                      ? link.href
                      : `${langPrefix}${link.href.startsWith('/') ? '' : '/'}${link.href}`

                  return (
                    <Link
                      key={link.href}
                      href={localizedHref}
                      onClick={onNavigate}
                      className={cn(
                        'group relative flex h-12 items-center gap-3 overflow-hidden rounded-xl px-5 transition-all duration-300 active:scale-95',
                        active
                          ? 'text-white'
                          : 'text-muted-foreground hover:bg-primary/5 hover:text-primary',
                        isCollapsed && 'justify-center px-0'
                      )}
                      title={isCollapsed ? link.label : undefined}
                    >
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="bg-primary absolute inset-0 z-0 shadow-sm"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      <Icon
                        className={cn(
                          'relative z-10 h-4 w-4 shrink-0 transition-transform duration-500 group-hover:scale-110',
                          isCollapsed ? 'mx-auto' : ''
                        )}
                      />

                      {!isCollapsed && (
                        <span className="relative z-10 flex-1 text-[11px] leading-tight font-black tracking-widest whitespace-normal uppercase">
                          {link.label}
                        </span>
                      )}

                      {/* Counter Badge */}
                      {link.badgeCount !== undefined &&
                        link.badgeCount > 0 &&
                        !isCollapsed && (
                          <span
                            className={cn(
                              'relative z-10 ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-xl border px-1.5 text-[10px] font-black transition-colors',
                              active
                                ? 'border-white/20 bg-white/20 text-white'
                                : 'bg-primary/5 text-primary border-primary/10'
                            )}
                          >
                            {link.badgeCount}
                          </span>
                        )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sign Out Section */}
      <div className="border-primary/5 border-t p-4 pb-10 sm:pb-6">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            'group hover:bg-destructive/10 hover:text-destructive h-14 w-full items-center justify-start gap-3 rounded-xl px-4 transition-all active:scale-95',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <div className="bg-primary/5 group-hover:bg-destructive/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="text-primary/60 group-hover:text-destructive text-[10px] font-black tracking-[0.2em] uppercase transition-colors">
              {config.signOutLabel}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
