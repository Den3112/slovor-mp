'use client'

import { useState, useEffect } from 'react'
import { useScrollPosition } from '@/lib/hooks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Menu, Plus, Grid3X3, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { motion, AnimatePresence } from 'framer-motion'

// New Components
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

  // Hide header logo on dashboard routes to allow sidebar logo to take over
  const isDashboard = pathname.includes('/admin') || pathname.includes('/profile') || pathname.includes('/messages')

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500',
          'safe-top',
          isDashboard ? 'bg-card border-b border-border/60 shadow-sm' : (isScrolled ? 'border-border/40 bg-background/95 border-b py-2' : 'bg-transparent py-4')
        )}
      >
        <Container>
          <div className="flex h-14 items-center justify-between gap-4 md:h-16">
            {/* 1. Logo & Business Trigger */}
            <div className="flex shrink-0 items-center gap-6">
              {!isDashboard && <Logo locale={locale} />}
              {isDashboard && <div className="md:hidden"><Logo locale={locale} size="sm" /></div>}

              {!isDashboard && (
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className={cn(
                    "hover:bg-muted group hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all lg:flex",
                    isMegaMenuOpen && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  data-testid="header-categories-btn"
                >
                  {isMegaMenuOpen ? <X className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  <span>{t('nav:categories')}</span>
                </button>
              )}
            </div>

            {/* 2. Command Center & Location (Desktop) */}
            <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
              {!isDashboard && (
                <>
                  <CommandCenter locale={locale} />
                  <LocationSwitcher />
                </>
              )}
            </div>

            {/* 3. Actions / Profile */}
            <div className="flex shrink-0 items-center gap-2 md:gap-4">
              <div className="hidden items-center gap-3 lg:flex">
                {user && <NotificationDropdown />}
                <LanguageSelector />
                <ThemeToggle />

                <div className="mx-1 h-6 w-px bg-border/40" />

                {user ? (
                  <UserMenu user={user} signOut={signOut} />
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-muted-foreground hover:text-foreground text-sm font-bold transition-colors"
                  >
                    {t('common:signIn')}
                  </Link>
                )}
              </div>

              {/* Mobile Menu Trigger & Theme Toggle */}
              <div className="flex items-center gap-2 lg:hidden">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="bg-muted/50 hover:bg-muted text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              {/* Add Listing CTA */}
              {!isDashboard && (
                <Link
                  href={`/${locale}/post`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25 group hidden items-center gap-2 rounded-full px-6 py-2.5 text-sm font-black shadow-lg transition-all hover:scale-105 active:scale-95 lg:flex"
                  data-testid="header-post-ad-btn"
                >
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  <span>{t('nav:postAd')}</span>
                </Link>
              )}
            </div>
          </div>
        </Container>

        {/* Mega Menu Overlay */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <MegaMenu locale={locale} onClose={() => setIsMegaMenuOpen(false)} />
          )}
        </AnimatePresence>
      </header >

      {/* Background Dim for Mega Menu */}
      <AnimatePresence>
        {
          isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMegaMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            />
          )
        }
      </AnimatePresence >

      <MobileDrawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        pathname={pathname}
        user={user}
        signOut={signOut}
      />

      {!isDashboard && (
        <BottomNavBar
          pathname={pathname}
          user={user}
          onSearchClick={() => setIsSearchOverlayOpen(true)}
        />
      )}

      <MobileSearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </>
  )
}
