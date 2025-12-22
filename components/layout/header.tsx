'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Category } from '@/lib/types/database'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X, Search, Plus, Store, ChevronDown, LayoutGrid } from 'lucide-react'
import { CategoryIcon } from '@/components/category/CategoryIcon'

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const pathname = usePathname()
  const { t, locale } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)

  // Mobile accordion state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const navLinks = [
    { href: '/', label: t.common.home },
    { href: '/listings', label: t.common.allListings },
  ]

  // Helper for localized names
  const getCategoryName = (cat: Category) => {
    if (locale === 'sk') return cat.name_sk || cat.name
    if (locale === 'cs') return cat.name_cs || cat.name
    if (locale === 'en') return cat.name_en || cat.name
    return t.categories[cat.slug] || cat.name
  }

  // Close menus on route change
  useEffect(() => {
    setMegaMenuOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  // Deduplicate categories by localized name
  const uniqueCategories = categories.reduce((acc: Category[], current) => {
    const currentName = getCategoryName(current).toLowerCase()
    const isDuplicate = acc.find(item => getCategoryName(item).toLowerCase() === currentName)
    if (!isDuplicate) {
      acc.push(current)
    } else if (!isDuplicate.subcategories?.length && current.subcategories?.length) {
      const index = acc.findIndex(item => getCategoryName(item).toLowerCase() === currentName)
      acc[index] = current
    }
    return acc
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-200/50 shadow-sm font-sans">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium tracking-wide">Slovor Marketplace</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/auth/login" className="hover:text-blue-300 transition">
              {t.common.login}
            </Link>
            <Link href="/auth/register" className="hover:text-blue-300 transition">
              {t.common.register}
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <nav className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-black text-blue-600 hover:text-blue-700 transition shrink-0 tracking-tighter">
            <Store className="w-8 h-8" />
            <span className="hidden sm:inline">SLOVOR</span>
          </Link>

          {/* Desktop: Mega Menu Trigger */}
          <div className="hidden md:block">
            <Button
              variant={megaMenuOpen ? "secondary" : "ghost"}
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`gap-2 text-base font-black uppercase tracking-widest ${megaMenuOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
            >
              <LayoutGrid className="w-5 h-5" />
              {t.common.categories}
            </Button>
          </div>

          {/* Search bar */}
          <form action="/listings" method="GET" className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full relative">
              <input
                type="text"
                name="search"
                placeholder={t.common.searchPlaceholder}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-r-2xl hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>


          {/* Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href="/post">
              <Button className="font-semibold shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0">
                + {t.common.postAd}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mega Menu Dropdown (Desktop) */}
        {megaMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8">
                {uniqueCategories.map((cat) => (
                  <div key={cat.id} className="group">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="flex items-center gap-2 font-bold text-gray-900 mb-3 hover:text-blue-600 transition"
                    >
                      <CategoryIcon slug={cat.slug} className="w-6 h-6 text-blue-600" />
                      {getCategoryName(cat)}
                    </Link>

                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ul className="space-y-1.5 ml-9 border-l-2 border-gray-100 pl-3">
                        {cat.subcategories.map(sub => (
                          <li key={sub.id}>
                            <Link
                              href={`/categories/${sub.slug}`}
                              className="text-sm text-gray-600 hover:text-blue-600 transition block py-0.5"
                            >
                              {getCategoryName(sub)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Categories Bar (Desktop - Horizontal Scroll) */}
      <div className="hidden md:flex border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {uniqueCategories.slice(0, 10).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-full transition whitespace-nowrap"
              >
                <CategoryIcon slug={cat.slug} className="w-4 h-4" />
                <span>{getCategoryName(cat)}</span>
              </Link>
            ))}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium"
            >
              {t.common.viewAll} →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[105px] bg-white z-40 overflow-y-auto pb-20 animate-in slide-in-from-right duration-300">
          <div className="p-4 space-y-6">
            {/* Mobile Search */}
            <form action="/listings" method="GET">
              <div className="flex">
                <input
                  type="text"
                  name="search"
                  placeholder={t.common.searchPlaceholder}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-5 bg-blue-600 text-white rounded-r-xl flex items-center justify-center"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>

            {/* Mobile Actions */}
            <Link
              href="/post"
              className="block w-full py-3 bg-blue-600 text-white text-center font-bold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition"
            >
              + {t.common.postAd}
            </Link>

            {/* Mobile Categories Accordion */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {t.common.categories}
              </h3>
              <div className="space-y-1">
                {uniqueCategories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="flex-1 py-3 flex items-center gap-3 font-medium text-gray-900"
                      >
                        <CategoryIcon slug={cat.slug} className="w-6 h-6 text-blue-600" />
                        {getCategoryName(cat)}
                      </Link>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                          className="p-3 text-gray-400 active:bg-gray-50"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {expandedCategory === cat.id && cat.subcategories && (
                      <div className="bg-gray-50 px-4 py-2 space-y-2 rounded-lg mb-2 mx-2">
                        {cat.subcategories.map(sub => (
                          <Link
                            key={sub.id}
                            href={`/categories/${sub.slug}`}
                            className="block py-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 border-l-2 border-gray-200 hover:border-blue-500 pl-3"
                          >
                            {getCategoryName(sub)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="border-t border-gray-100 pt-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-gray-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
