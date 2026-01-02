'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import {
  Menu,
  X,
  Plus,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const FlagSK = () => (
  <svg viewBox="0 0 640 480" className="h-full w-full object-cover">
    <path fill="#ffffff" d="M0 0h640v480H0z" />
    <path fill="#ffffff" d="M0 160h640v320H0z" />
    <path fill="#0b4ea2" d="M0 160h640v160H0z" />
    <path fill="#ee1c25" d="M0 320h640v160H0z" />
    <path
      fill="#ffffff"
      d="M190 200c0 40-10 80-50 80-40 0-50-40-50-80h100z"
      transform="translate(40)"
    />
    <path
      fill="#0b4ea2"
      d="M185 205c0 30-5 60-35 60-30 0-35-30-35-60h70z"
      transform="translate(40)"
    />
    <path
      fill="#ee1c25"
      d="M165 240l10 20 10-20h-20z"
      transform="translate(40)"
    />
  </svg>
)

const FlagUS = () => (
  <svg viewBox="0 0 640 480" className="h-full w-full object-cover">
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path
      stroke="#fff"
      strokeWidth="37"
      d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
    />
    <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
    <marker id="us-star" markerWidth="30" markerHeight="30" viewBox="0 0 18 18">
      <path fill="#fff" d="M9 0l3 6 6 .8-4 5 1 7-6-3-6 3 1-7-4-5 6-.8z" />
    </marker>
  </svg>
)

const SUPPORTED_LOCALES = [
  { code: 'sk', name: 'Slovenský', flag: <FlagSK /> },
  { code: 'en', name: 'English', flag: <FlagUS /> },
]

export function Header() {
  const { locale, setLocale, t } = useTranslation()
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t.common.home },
    { href: '/listings', label: t.common.allListings },
    { href: '/categories', label: t.common.categories },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        isScrolled
          ? 'shadow-premium border-b border-border bg-background/70 py-3 backdrop-blur-2xl'
          : 'bg-transparent py-5'
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* Logo - Column 1 (Flex-1 for perfect centering of Col 2) */}
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              className="group relative z-50 flex items-center gap-3"
            >
              <div className="relative h-11 w-11">
                <div className="absolute inset-0 rotate-6 rounded-2xl bg-gradient-to-tr from-primary via-violet-500 to-primary shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-white text-2xl font-black text-foreground dark:bg-zinc-900">
                  S
                </div>
              </div>
              <span className="flex items-baseline font-heading text-2xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary md:text-3xl">
                Slovor
                <span className="group-hover:animate-bounce-subtle text-primary">
                  .
                </span>
              </span>
            </Link>
          </div>

          <div className="pointer-events-none hidden flex-1 items-center justify-center lg:flex">
            <nav className="group pointer-events-auto flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/20 p-2 shadow-inner backdrop-blur-3xl transition-all hover:bg-muted/30">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname?.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative rounded-full px-9 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all',
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

          {/* Right Actions - Anchored to the right */}
          <div className="hidden flex-1 items-center justify-end gap-6 text-foreground lg:flex">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                onBlur={() => setTimeout(() => setShowLangMenu(false), 200)}
                className="flex items-center gap-3 rounded-full border border-border/40 bg-muted/20 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-muted/40"
              >
                <div className="flex h-4 w-6 items-center justify-center overflow-hidden rounded-sm bg-zinc-800 shadow-sm">
                  <div className="h-full w-full scale-125 transform saturate-[1.2]">
                    {SUPPORTED_LOCALES.find((l) => l.code === locale)?.flag}
                  </div>
                </div>
                <span className="text-xs">{locale.toUpperCase()}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 opacity-40 transition-transform duration-500',
                    showLangMenu && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="shadow-premium absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-2xl border border-border bg-card/90 p-2 backdrop-blur-2xl"
                  >
                    {SUPPORTED_LOCALES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code as 'sk' | 'en')}
                        className={cn(
                          'flex w-full items-center gap-4 rounded-xl px-5 py-4 text-sm font-bold transition-all',
                          locale === lang.code
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <div className="flex h-5 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-zinc-800">
                          <div className="h-full w-full scale-125 transform saturate-[1.2]">
                            {lang.flag}
                          </div>
                        </div>
                        <span className="flex-1 text-left">{lang.name}</span>
                        {locale === lang.code && (
                          <div className="shadow-glow h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4 border-l border-border/50 pl-6">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                    className="group flex items-center gap-2"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary via-violet-500 to-indigo-500 p-[1.5px] shadow-lg shadow-primary/10 transition-transform group-hover:scale-105">
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-primary/10 bg-card font-black text-primary">
                        {user.user_metadata?.avatar_url ? (
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          user.email?.[0]?.toUpperCase()
                        )}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="shadow-premium absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-3xl border border-border bg-card/95 backdrop-blur-2xl"
                      >
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-5">
                          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            {t.auth.signedInAs}
                          </p>
                          <p className="truncate text-sm font-bold text-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-2.5">
                          <Link
                            href="/dashboard"
                            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                          >
                            <LayoutDashboard className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                            {t.common.dashboard}
                          </Link>
                          <Link
                            href="/profile"
                            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                          >
                            <User className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                            {t.common.profile}
                          </Link>
                          <div className="mx-2 my-1 h-px bg-border/50" />
                          <button
                            onClick={() => signOut()}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-destructive transition-all hover:bg-destructive/5"
                          >
                            <LogOut className="h-4 w-4" />
                            {t.auth.signOut}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-full border border-border/20 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground shadow-sm transition-all hover:bg-muted/50 active:scale-95"
                >
                  {t.auth.signIn}
                </Link>
              )}

              {/* POST BUTTON */}
              <Button
                asChild
                size="lg"
                className="group h-11 rounded-full px-7 font-black shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40"
              >
                <Link href="/post">
                  <Plus className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
                  {t.common.postAd}
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 lg:hidden">
            {user && (
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-black text-primary"
              >
                {user.email?.[0]?.toUpperCase()}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50 rounded-full p-2 text-foreground transition-colors hover:bg-muted"
            >
              {mobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 left-0 top-0 z-[40] flex h-screen w-full flex-col bg-background p-8 pt-28"
            >
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-black tracking-tighter text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-8 pb-10">
                <div className="flex gap-4">
                  {SUPPORTED_LOCALES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code as 'sk' | 'en')}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-3 rounded-2xl border py-4 font-black transition-all',
                        locale === lang.code
                          ? 'scale-105 border-primary bg-primary text-white shadow-lg shadow-primary/20'
                          : 'border-transparent bg-muted/50 text-muted-foreground'
                      )}
                    >
                      <div className="flex h-5 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-zinc-800">
                        <div className="h-full w-full scale-125 transform saturate-[1.2]">
                          {lang.flag}
                        </div>
                      </div>
                      {lang.name}
                    </button>
                  ))}
                </div>

                <Button
                  asChild
                  className="h-16 w-full rounded-[1.5rem] text-xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/post">
                    <Plus className="mr-2 h-6 w-6" />
                    {t.common.postAd}
                  </Link>
                </Button>

                {!user && (
                  <Link
                    href="/auth/login"
                    className="block w-full rounded-[1.5rem] border border-border/50 bg-muted/30 py-5 text-center text-lg font-black text-foreground transition-colors active:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.auth.hasAccount}{' '}
                    <span className="italic text-primary">{t.auth.signIn}</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  )
}
