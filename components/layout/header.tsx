'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Menu, X, Globe, Plus, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const SUPPORTED_LOCALES = [
  { code: 'sk', name: 'Slovenský' },
  { code: 'en', name: 'English' },
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
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "py-3 bg-background/70 backdrop-blur-2xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "py-5 bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-3 group z-50">
            <div className="relative w-10 h-10 md:w-11 md:h-11">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-violet-500 to-primary rounded-xl rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/20" />
              <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center font-black text-xl md:text-2xl text-foreground">
                S
              </div>
            </div>
            <span className="font-heading font-black text-2xl md:text-3xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
              Slovor<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-bold transition-all relative group py-2",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-6 pl-6 border-l border-border/50">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  onBlur={() => setTimeout(() => setShowLangMenu(false), 200)}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                >
                  <Globe className="w-4 h-4" />
                  {locale}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showLangMenu && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-40 bg-card rounded-2xl shadow-premium border border-border p-2 z-50 backdrop-blur-xl"
                    >
                      {SUPPORTED_LOCALES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLocale(lang.code as 'sk' | 'en')}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all",
                            locale === lang.code
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          )}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-violet-500/20 p-[1px] group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-black text-primary border border-primary/10">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-card rounded-[1.5rem] shadow-premium border border-border overflow-hidden z-50"
                      >
                        <div className="px-5 py-4 bg-muted/30">
                          <p className="text-xs font-black text-primary uppercase tracking-[0.1em] mb-1">{t.auth.signedInAs}</p>
                          <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            {t.common.dashboard}
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-all"
                          >
                            <User className="w-4 h-4 text-primary" />
                            {t.common.profile}
                          </Link>
                          <div className="h-px bg-border/50 my-1 px-2" />
                          <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                          >
                            <LogOut className="w-4 h-4" />
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
                  className="text-sm font-black text-foreground hover:text-primary transition-colors px-4 py-2"
                >
                  {t.auth.signIn}
                </Link>
              )}

              {/* POST BUTTON */}
              <Button asChild size="lg" className="rounded-full h-12 px-6 font-black shadow-lg shadow-primary/20 group">
                <Link href="/post">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                  {t.common.postAd}
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-4">
            {user && (
              <Link href="/dashboard" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs border border-primary/20">
                {user.email?.[0]?.toUpperCase()}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50 p-2 text-foreground hover:bg-muted rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
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
              className="fixed inset-0 top-0 left-0 w-full h-screen bg-background z-[40] flex flex-col p-8 pt-28"
            >
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-black text-foreground tracking-tighter hover:text-primary transition-colors"
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
                        "flex-1 py-4 text-center font-black rounded-2xl border transition-all",
                        locale === lang.code
                          ? "bg-primary text-white border-primary"
                          : "bg-muted/50 text-muted-foreground border-transparent"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <Button asChild className="w-full h-16 rounded-[1.5rem] text-xl font-black" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/post">
                    <Plus className="w-6 h-6 mr-2" />
                    {t.common.postAd}
                  </Link>
                </Button>

                {!user && (
                  <Link
                    href="/auth/login"
                    className="block w-full text-center py-4 font-black text-foreground text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.auth.hasAccount} <span className="text-primary italic">{t.auth.signIn}</span>
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
