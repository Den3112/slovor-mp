'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Menu, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

import { LanguageSelector } from './language-selector'
import { UserMenu } from './user-menu'
import { MobileDrawer } from './mobile-drawer'
import { CommandCenter } from './command-center'
import { LocationSwitcher } from './location-switcher'
import { MobileSearchOverlay } from './mobile-search-overlay'
import { Logo } from '@/components/ui/logo'
import { Heart, MessageCircle } from 'lucide-react'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

export function Header() {
  const { t, locale } = useTranslation(['common', 'nav'])
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const unreadCount = useUnreadMessages()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false)
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
          'sticky top-0 z-50 w-full h-16 bg-background border-b border-border transition-none',
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo Area */}
            <div className="flex shrink-0 items-center gap-4">
              <Logo locale={locale} />
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
                <LanguageSelector />
                <ThemeToggle />

                <div className="mx-2 h-6 w-px bg-border/60" />

                {/* Favorites */}
                <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                  <Link href={`/${locale}/favorites`}>
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                  <Link href={`/${locale}/messages`}>
                    <MessageCircle className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-background">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <div className="mx-2 h-6 w-px bg-border/60" />

                {user ? (
                  <UserMenu user={user} signOut={signOut} />
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 hover:text-primary transition-colors px-2"
                  >
                    {t('common:signIn')}
                  </Link>
                )}

                {/* Post Ad CTA */}
                <Button asChild className="gap-2 font-bold uppercase tracking-widest ml-2 shadow-md shadow-primary/20">
                  <Link href={`/${locale}/post`} data-testid="header-post-ad-btn">
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    <span>{t('nav:postAd')}</span>
                  </Link>
                </Button>
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
