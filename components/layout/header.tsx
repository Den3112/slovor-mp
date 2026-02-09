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

  // Ensure header is visible everywhere as per user request

  return (
    <>
      <header
        className={cn(
          'bg-background border-border sticky top-0 z-50 h-(--header-height) w-full border-b antialiased transition-all duration-300'
        )}
      >
        <Container className="h-full px-4 sm:px-6">
          <div className="flex h-full items-center justify-between gap-2 sm:gap-4 md:gap-8">
            {/* Logo area with Category Trigger */}
            <div className="flex shrink-0 items-center gap-4 sm:gap-8">
              <Logo locale={locale} />

              <button
                className={cn(
                  'hidden items-center gap-2.5 rounded-lg px-4 py-2 text-[11px] font-bold tracking-widest uppercase transition-all active:scale-[0.98] lg:flex',
                  isMegaMenuOpen
                    ? 'bg-primary shadow-primary/20 text-white shadow-lg'
                    : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border-border border'
                )}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                <LayoutGrid
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isMegaMenuOpen && 'scale-110'
                  )}
                />
                <span>{t('nav:categories')}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-300',
                    isMegaMenuOpen && 'rotate-180'
                  )}
                />
              </button>
            </div>

            {/* Central Expressive Search - Desktop */}
            <div className="hidden max-w-xl flex-1 items-center justify-center md:flex">
              <div className="group relative w-full">
                <CommandCenter locale={locale} />
                {/* Visual indicator of center focus */}
                <div className="bg-primary absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 opacity-50 transition-all duration-500 group-focus-within:w-1/2" />
              </div>
            </div>

            {/* Premium Actions Area */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-3 lg:flex">
                {/* Secondary Actions */}
                <div className="border-border/40 flex items-center gap-1.5 border-r pr-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>

                {/* Engagement Icons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 w-10 rounded-lg transition-all"
                    aria-label={t('nav:favorites') || 'Favorites'}
                  >
                    <Link href={`/${locale}/dashboard/favorites`}>
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 relative h-10 w-10 rounded-lg transition-all"
                    aria-label={t('nav:messages') || 'Messages'}
                  >
                    <Link href={`/${locale}/dashboard/messages`}>
                      <MessageCircle className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="bg-primary ring-background absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-lg text-[9px] font-bold text-white ring-2">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </div>

                <div className="bg-border/40 mx-1 h-8 w-px" />

                {user ? (
                  <UserMenu user={user} signOut={signOut} />
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-muted-foreground/80 hover:text-primary px-3 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
                  >
                    {t('common:signIn')}
                  </Link>
                )}

                {/* Primary CTA - Post Ad */}
                <Button
                  asChild
                  className="bg-primary hover:bg-primary-hover shadow-primary ml-2 h-12 gap-2.5 rounded-lg border-0 px-6 text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
                >
                  <Link
                    href={`/${locale}/post`}
                    data-testid="header-post-ad-btn"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                    <span>{t('nav:postAd')}</span>
                  </Link>
                </Button>
              </div>

              <div className="flex shrink-0 items-center gap-3 lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOverlayOpen(true)}
                  className="bg-card h-10 w-10 rounded-lg sm:h-9 sm:w-9"
                  aria-label={t('common:search') || 'Search'}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="bg-card h-10 w-10 rounded-lg sm:h-9 sm:w-9"
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
