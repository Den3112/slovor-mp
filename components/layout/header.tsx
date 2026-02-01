'use client'

import { useState, useEffect } from 'react'
import { useScrollPosition } from '@/lib/hooks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Menu, Plus, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

import { LanguageSelector } from './language-selector'
import { UserMenu } from './user-menu'
import { BottomNavBar } from './bottom-nav-bar'
import { MobileDrawer } from './mobile-drawer'
import { CommandCenter } from './command-center'
import { LocationSwitcher } from './location-switcher'
import { MegaMenu } from './mega-menu'
import { MobileSearchOverlay } from './mobile-search-overlay'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { Logo } from '@/components/ui/logo'

export function Header() {
  const { t, locale } = useTranslation(['common', 'nav'])
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { isScrolled } = useScrollPosition(10)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setIsMegaMenuOpen(false)
  }, [pathname])

  if (!mounted) return null

  // Hide header on dashboard routes
  const isDashboard = pathname.includes('/admin') || pathname.includes('/profile') || pathname.includes('/messages')

  if (isDashboard) {
    return null
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-card/95 backdrop-blur-sm border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo & Categories Trigger */}
            <div className="flex shrink-0 items-center gap-4">
              <Logo locale={locale} />

              {/* Categories Button - Desktop */}
              <Button
                variant={isMegaMenuOpen ? 'default' : 'ghost'}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="hidden lg:flex items-center gap-2 font-medium"
                data-testid="header-categories-btn"
              >
                {isMegaMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span>{t('nav:categories')}</span>
              </Button>
            </div>

            {/* Search & Location - Desktop */}
            <div className="hidden flex-1 max-w-2xl items-center justify-center gap-3 md:flex">
              <CommandCenter locale={locale} />
              <LocationSwitcher />
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Desktop Actions */}
              <div className="hidden items-center gap-2 lg:flex">
                {user && <NotificationDropdown />}
                <LanguageSelector />
                <ThemeToggle />

                <div className="mx-2 h-6 w-px bg-border" />

                {user ? (
                  <UserMenu user={user} signOut={signOut} />
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('common:signIn')}
                  </Link>
                )}

                {/* Post Ad CTA */}
                <Link href={`/${locale}/post`} data-testid="header-post-ad-btn">
                  <Button className="gap-2 font-semibold">
                    <Plus className="h-4 w-4" />
                    <span>{t('nav:postAd')}</span>
                  </Button>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOverlayOpen(true)}
                  className="h-9 w-9"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Container>

        {/* Mega Menu */}
        {isMegaMenuOpen && (
          <>
            <MegaMenu locale={locale} onClose={() => setIsMegaMenuOpen(false)} />
            <div
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMegaMenuOpen(false)}
            />
          </>
        )}
      </header>

      <MobileDrawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        pathname={pathname}
        user={user}
        signOut={signOut}
      />

      <BottomNavBar
        pathname={pathname}
        user={user}
        onSearchClick={() => setIsSearchOverlayOpen(true)}
      />

      <MobileSearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </>
  )
}
