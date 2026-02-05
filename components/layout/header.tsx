'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Menu, Plus, Search, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

import { LanguageSelector } from './language-selector'
import { UserMenu } from './user-menu'
import { MobileDrawer } from './mobile-drawer'
import { CommandCenter } from './command-center'
import { MobileSearchOverlay } from './mobile-search-overlay'
import { Logo } from '@/components/ui/logo'
import { Heart, MessageCircle, ChevronDown } from 'lucide-react'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'
import { MegaMenu } from './mega-menu'

export function Header() {
  const { t, locale } = useTranslation(['common', 'nav'])
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const unreadCount = useUnreadMessages()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (!mounted) return null

  // Hide header on dashboard routes
  const isDashboard = pathname?.includes('/admin') || pathname?.includes('/dashboard') || pathname?.includes('/messages') || pathname?.includes('/favorites')

  if (isDashboard) {
    return null
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full h-[80px] bg-background border-b border-border antialiased transition-all duration-300',
        )}
      >
        <Container className="h-full">
          <div className="flex h-full items-center justify-between gap-8">
            {/* Logo area with Category Trigger */}
            <div className="flex shrink-0 items-center gap-8">
              <Logo locale={locale} />

              <button
                className={cn(
                  "hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all active:scale-[0.98]",
                  isMegaMenuOpen
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                )}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                <LayoutGrid className={cn("w-4 h-4 transition-transform", isMegaMenuOpen && "scale-110")} />
                <span>{t('nav:categories')}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isMegaMenuOpen && "rotate-180")} />
              </button>
            </div>

            {/* Central Expressive Search - Desktop */}
            <div className="hidden flex-1 max-w-xl items-center justify-center md:flex">
              <div className="w-full relative group">
                <CommandCenter locale={locale} />
                {/* Visual indicator of center focus */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within:w-1/2 opacity-50" />
              </div>
            </div>

            {/* Premium Actions Area */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-3 lg:flex">
                {/* Secondary Actions */}
                <div className="flex items-center gap-1.5 pr-2 border-r border-border/40">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>

                {/* Engagement Icons */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Link href={`/${locale}/favorites`}>
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>

                  <Button variant="ghost" size="icon" asChild className="relative h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Link href={`/${locale}/messages`}>
                      <MessageCircle className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-lg bg-primary text-[9px] font-bold text-white ring-2 ring-background">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </div>

                <div className="mx-1 h-8 w-px bg-border/40" />

                {user ? (
                  <UserMenu user={user} signOut={signOut} />
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 hover:text-primary transition-colors px-3 py-2"
                  >
                    {t('common:signIn')}
                  </Link>
                )}

                {/* Primary CTA - Post Ad */}
                <Button asChild className="h-12 rounded-xl px-6 gap-2.5 font-semibold text-[15px] ml-2 bg-primary hover:bg-primary-hover text-white border-0 shadow-primary transition-all active:scale-[0.98]">
                  <Link href={`/${locale}/post`} data-testid="header-post-ad-btn">
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                    <span>{t('nav:postAd')}</span>
                  </Link>
                </Button>
              </div>

              {/* Mobile Interaction Trigger */}
              <div className="flex items-center gap-2 lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOverlayOpen(true)}
                  className="h-10 w-10 rounded-xl bg-muted/40"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="h-10 w-10 rounded-xl bg-muted/40"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Container>

        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>

      <MobileDrawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        pathname={pathname}
        user={user}
        signOut={signOut}
      />


      <MobileSearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </>
  )
}
