'use client'

import { useState, useEffect } from 'react'
import { useScrollPosition } from '@/lib/hooks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Menu, Plus, Home, Grid3X3, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { motion } from 'framer-motion'

// Extracted components for code minimization (Rule #1)
import { LanguageSelector } from './language-selector'
import { UserMenu } from './user-menu'
import { BottomNavBar } from './bottom-nav-bar'
import { MobileDrawer } from './mobile-drawer'
import { CategoriesDropdown } from './categories-dropdown'

// Logo component - reused in header and drawer
function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('group relative z-50 flex items-center gap-2 md:gap-3', className)}
    >
      <div className="relative h-9 w-9 md:h-11 md:w-11">
        <div className="absolute inset-0 rotate-6 rounded-xl bg-gradient-to-tr from-primary via-violet-500 to-primary shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 md:rounded-2xl" />
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-border/20 bg-card text-lg font-black text-foreground md:rounded-2xl md:text-2xl">
          S
        </div>
      </div>
      <span className="flex items-baseline font-heading text-xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary md:text-3xl">
        Slovor
        <span className="group-hover:animate-bounce-subtle text-primary">.</span>
      </span>
    </Link>
  )
}

// Desktop navigation pill
interface DesktopNavProps {
  navLinks: { href: string; label: string; icon: React.ComponentType }[]
  pathname: string | null
}

function DesktopNav({ navLinks, pathname }: DesktopNavProps) {
  return (
    <div className="pointer-events-none hidden flex-1 items-center justify-center lg:flex">
      <nav className="group pointer-events-auto flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 p-1.5 shadow-inner backdrop-blur-3xl transition-all hover:bg-muted/30">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/' && pathname?.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex h-10 items-center justify-center rounded-full px-4 text-center text-[10px] font-black uppercase leading-none tracking-[0.15em] transition-all xl:px-8',
                isActive
                  ? 'text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
                  transition={{
                    type: 'spring',
                    bounce: 0.15,
                    duration: 0.6,
                  }}
                />
              )}
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// Loading skeleton for SSR
function HeaderSkeleton() {
  return (
    <header className={cn('fixed top-0 z-50 w-full py-5 transition-all duration-500', 'safe-top bg-transparent')}>
      <Container>
        <div className="flex h-14 items-center justify-between md:h-16">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>
        </div>
      </Container>
    </header>
  )
}

export function Header() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use extracted scroll hook (Rule #3: One responsibility)
  const { isScrolled } = useScrollPosition(10)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: t.common.home, icon: Home },
    { href: '/listings', label: t.common.allListings, icon: Search },
    { href: '/categories', label: t.common.categories, icon: Grid3X3 },
    { href: '/blog', label: 'Blog', icon: Grid3X3 },
  ]

  if (!mounted) {
    return <HeaderSkeleton />
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500',
          'safe-top',
          isScrolled
            ? 'shadow-premium border-b border-border bg-background/80 py-2 backdrop-blur-2xl md:py-3'
            : 'bg-transparent py-3 md:py-5'
        )}
      >
        <Container>
          <div className="flex h-12 items-center justify-between md:h-16">
            {/* Logo */}
            <div className="flex flex-1 items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <DesktopNav navLinks={navLinks} pathname={pathname} />

            {/* Desktop Right Actions */}
            <div className="hidden flex-1 items-center justify-end gap-3 text-foreground lg:flex xl:gap-6">
              {/* Categories Dropdown */}
              <CategoriesDropdown />

              <LanguageSelector />
              <ThemeToggle className="self-center" />

              {/* User Section */}
              <div className="flex items-center gap-2 border-l border-border/50 pl-3 xl:gap-4 xl:pl-6">
                {user ? (
                  <UserMenu user={user} signOut={signOut} />
                ) : (
                  <Link
                    href="/login"
                    className="flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-primary transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 active:scale-95 xl:px-7"
                  >
                    {t.auth.signIn}
                  </Link>
                )}

                {/* POST BUTTON */}
                <Link
                  href="/post"
                  className="group flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-5 text-[10px] font-black uppercase tracking-[0.15em] text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95 xl:px-7"
                >
                  <Plus className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90" />
                  <span className="hidden xl:inline">{t.common.postAd}</span>
                  <span className="xl:hidden">Post</span>
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />

              {user && (
                <Link
                  href="/profile/settings"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-black text-primary transition-transform active:scale-95"
                >
                  {user.email?.[0]?.toUpperCase()}
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'relative z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-border/40 bg-muted/30 text-foreground transition-colors hover:bg-muted',
                  pathname?.startsWith('/profile') && 'hidden'
                )}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        navLinks={navLinks}
        pathname={pathname}
        user={user}
        signOut={signOut}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        navLinks={navLinks.filter(link => link.href !== '/blog')}
        pathname={pathname}
        user={user}
      />
    </>
  )
}
