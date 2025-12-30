'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { categoriesApi } from '@/lib/supabase/queries'
import type { Category } from '@/lib/types/database'
import { getUniqueCategories, getCategoryName } from '@/lib/utils/category-helpers'
import { Facebook, Instagram, Twitter, Mail, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/container'

export function Footer() {
  const { t, locale } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.getAll().then(res => {
      if (res.data) setCategories(res.data)
    })
  }, [])

  const uniqueCategories = getUniqueCategories(categories, locale, t)
  const topCategories = uniqueCategories.slice(0, 5)

  const navGroups = [
    {
      title: t.footer.popular,
      links: topCategories.map(cat => ({
        label: getCategoryName(cat, locale, t),
        href: `/categories/${cat.slug}`
      }))
    },
    {
      title: t.footer.quickLinks,
      links: [
        { label: t.common.home, href: '/' },
        { label: t.common.allListings, href: '/listings' },
        { label: t.common.postAd, href: '/post' },
        { label: t.common.marketTrends, href: '/blog' }
      ]
    },
    {
      title: t.footer.info,
      links: [
        { label: t.footer.about, href: '/about' },
        { label: t.footer.terms, href: '/terms' },
        { label: t.footer.privacy, href: '/privacy' },
        { label: t.footer.faq, href: '/faq' }
      ]
    }
  ]

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 pt-24 pb-12 overflow-hidden border-t border-zinc-900">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center font-black text-white text-xl">S</div>
              <span className="text-3xl font-black text-white tracking-tighter">Slovor<span className="text-primary">.</span></span>
            </Link>
            <p className="text-lg font-medium leading-relaxed max-w-sm text-zinc-500 italic">
              &ldquo;{t.footer.description}&rdquo;
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "#" },
                { icon: <Instagram className="w-5 h-5" />, href: "#" },
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-lg border border-zinc-800"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            {navGroups.map((group, i) => (
              <div key={i}>
                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-base font-bold text-zinc-500 hover:text-primary transition-colors flex items-center group gap-1"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter & Contact */}
        <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-zinc-800 mb-24 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h3 className="text-2xl font-black text-white mb-2">{t.footer.newsletterTitle}</h3>
            <p className="font-medium text-zinc-500">{t.footer.newsletterSubtitle}</p>
          </div>
          <div className="flex-1 w-full max-w-lg flex items-center gap-2">
            <div className="relative flex-1 group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder={t.footer.newsletterPlaceholder}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <button className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20">
              {t.footer.subscribe}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-zinc-900 text-xs font-black uppercase tracking-widest text-zinc-600">
          <p>© {new Date().getFullYear()} Slovor Marketplace. {t.footer.rights}.</p>
          <div className="flex gap-10">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Slovakia / EUR
            </span>
            <Link href="/terms" className="hover:underline">{t.footer.transparency}</Link>
            <Link href="/privacy" className="hover:underline">{t.footer.privacyPolicy}</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
