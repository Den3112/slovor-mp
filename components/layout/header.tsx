'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Search, Menu, X, Globe, Plus, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'

const SUPPORTED_LOCALES = [
  { code: 'sk', name: 'Slovenský' },
  { code: 'en', name: 'English' },
]

export function Header() {
  const { locale, setLocale, t } = useTranslation()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t.common.home },
    { href: '/categories', label: t.common.categories },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.elements.namedItem('search') as HTMLInputElement
    const query = input.value.trim()

    if (query) {
      router.push(`/listings?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-border shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-primary to-violet-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-heading font-bold text-xl md:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">
              Slovor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{locale}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-popover rounded-xl shadow-glass border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {SUPPORTED_LOCALES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code as 'sk' | 'en')
                            setShowLangMenu(false)
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                            locale === lang.code
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-muted/50 p-1.5 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-popover rounded-xl shadow-glass border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                      <div className="px-3 py-2 text-sm font-medium border-b border-border/50 text-muted-foreground truncate">
                        {user.email}
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Post Ad Button */}
              <Link
                href="/post"
                className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                {t.common.postAd}
              </Link>
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">
            {user ? (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-xs">
                {user.email?.[0]?.toUpperCase()}
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm font-bold">Sign In</Link>
            )}
            <button
              className="text-foreground p-2 hover:bg-muted rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col p-6 gap-4 h-full border-t border-border/40">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground py-3 border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Search */}
              <div className="py-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    name="search"
                    type="text"
                    placeholder={t.common.searchPlaceholder}
                    defaultValue={searchParams.get('search') || ''}
                    className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                  />
                </form>
              </div>

              <div className="mt-auto pb-8 space-y-4">
                <div className="flex gap-2 justify-center pb-4">
                  {SUPPORTED_LOCALES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code as 'sk' | 'en')}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium border",
                        locale === lang.code
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <Link
                  href="/post"
                  className="flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="w-5 h-5" />
                  {t.common.postAd}
                </Link>

                {user && (
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="flex w-full items-center justify-center gap-2 text-destructive px-6 py-4 font-bold"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
