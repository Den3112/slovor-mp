'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { categoriesApi } from '@/lib/supabase/queries'
import type { Category } from '@/lib/types/database'

export function Footer() {
  const { t, locale } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.getAll().then(res => {
      if (res.data) setCategories(res.data)
    })
  }, [])

  // Deduplicate categories by localized name
  const uniqueCategories = categories.reduce((acc: Category[], current) => {
    const currentName = (locale === 'sk' ? current.name_sk || current.name :
      locale === 'cs' ? current.name_cs || current.name :
        locale === 'en' ? current.name_en || current.name :
          t.categories[current.slug] || current.name).toLowerCase()

    const isDuplicate = acc.find(item => {
      const itemName = (locale === 'sk' ? item.name_sk || item.name :
        locale === 'cs' ? item.name_cs || item.name :
          locale === 'en' ? item.name_en || item.name :
            t.categories[item.slug] || item.name).toLowerCase()
      return itemName === currentName
    })

    if (!isDuplicate) {
      acc.push(current)
    }
    return acc
  }, [])

  // Get first 6 categories with translations
  const topCategories = uniqueCategories.slice(0, 6).map(cat => ({
    href: `/categories/${cat.slug}`,
    label: locale === 'sk' ? cat.name_sk || cat.name :
      locale === 'cs' ? cat.name_cs || cat.name :
        locale === 'en' ? cat.name_en || cat.name :
          t.categories[cat.slug] || cat.name,
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
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <span className="text-3xl">🏪</span>
              <span>Slovor</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <span className="text-lg">📘</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition">
                <span className="text-lg">📸</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition">
                <span className="text-lg">🐦</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.common.categories}</h4>
            <ul className="space-y-2">
              {topCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-white transition flex items-center gap-2"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/listings"
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  {t.common.viewAll} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.information}</h4>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6">
              <h5 className="text-white font-medium mb-2">{t.footer.contact}</h5>
              <p className="text-sm text-gray-400">
                📧 info@slovor.sk
              </p>
              <p className="text-sm text-gray-400">
                📍 Bratislava, Slovakia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Slovor Marketplace. {t.footer.copyright}
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>EUR (€)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
