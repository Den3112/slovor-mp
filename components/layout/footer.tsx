'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { categoriesApi } from '@/lib/supabase/queries'
import type { Category } from '@/lib/types/database'
import { getUniqueCategories, getCategoryName } from '@/lib/utils/category-helpers'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'

export function Footer() {
  const { t, locale } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.getAll().then(res => {
      if (res.data) setCategories(res.data)
    })
  }, [])

  const uniqueCategories = getUniqueCategories(categories, locale, t)

  const topCategories = uniqueCategories.slice(0, 6).map(cat => ({
    href: `/categories/${cat.slug}`,
    label: getCategoryName(cat, locale, t),
    icon: cat.icon,
  }))

  const quickLinks = [
    { href: '/', label: t.common.home },
    { href: '/listings', label: t.common.allListings },
    { href: '/post', label: t.common.postAd },
    { href: '/auth/login', label: t.common.login },
    { href: '/auth/register', label: t.common.register },
  ]

  const infoLinks = [
    { href: '/about', label: t.footer.about },
    { href: '/contact', label: t.footer.contact },
    { href: '/terms', label: t.footer.terms },
    { href: '/privacy', label: t.footer.privacy },
    { href: '/faq', label: t.footer.faq },
  ]

  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-auto border-t border-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-2xl font-bold text-white font-heading tracking-tight">Slovor</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">{t.common.categories}</h4>
            <ul className="space-y-3">
              {topCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/listings"
                  className="text-sm text-primary hover:text-primary/80 transition font-medium inline-flex items-center gap-1 mt-2"
                >
                  {t.common.viewAll} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">{t.footer.information}</h4>
            <ul className="space-y-3 mb-8">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h5 className="text-white font-medium text-sm mb-1">{t.footer.contact}</h5>
                  <a href="mailto:info@slovor.sk" className="text-sm hover:text-white transition-colors">info@slovor.sk</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900 bg-zinc-950/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-500">
            <p>
              © {new Date().getFullYear()} Slovor Marketplace. {t.footer.copyright}
            </p>
            <div className="flex gap-6">
              <span>EUR (€)</span>
              <span className="w-px h-4 bg-zinc-800"></span>
              <span>Slovakia (SK)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
