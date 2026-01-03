'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { categoriesApi } from '@/lib/api'
import type { Category } from '@/lib/types/database'
import {
  getUniqueCategories,
  getCategoryName,
} from '@/lib/utils/category-helpers'
import { Facebook, Instagram, Twitter, Mail, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/container'

export function Footer() {
  const { t, locale } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      if (res.data) setCategories(res.data)
    })
  }, [])

  const uniqueCategories = getUniqueCategories(categories, locale, t)
  const topCategories = uniqueCategories.slice(0, 5)

  const navGroups = [
    {
      title: t.footer.popular,
      links: topCategories.map((cat) => ({
        label: getCategoryName(cat, locale, t),
        href: `/categories/${cat.slug}`,
      })),
    },
    {
      title: t.footer.quickLinks,
      links: [
        { label: t.common.home, href: '/' },
        { label: t.common.allListings, href: '/listings' },
        { label: t.common.postAd, href: '/post' },
        { label: t.common.marketTrends, href: '/blog' },
      ],
    },
    {
      title: t.footer.info,
      links: [
        { label: t.footer.about, href: '/about' },
        { label: t.footer.terms, href: '/terms' },
        { label: t.footer.privacy, href: '/privacy' },
        { label: t.footer.faq, href: '/faq' },
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.03] bg-zinc-950 pb-16 pt-32 text-zinc-400">
      {/* Decorative Elements */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-600/5 blur-[150px]" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] [mask-image:radial-gradient(white,transparent_70%)]" />

      <Container className="relative z-10">
        <div className="mb-32 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="space-y-10 lg:col-span-4">
            <Link href="/" className="group flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-violet-500 to-indigo-500 text-2xl font-black text-white shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:rotate-6">
                S
              </div>
              <span className="text-4xl font-black tracking-tighter text-white">
                Slovor
                <span className="text-primary group-hover:animate-pulse">
                  .
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-xl font-medium italic leading-relaxed text-zinc-500">
              &ldquo;{t.footer.description}&rdquo;
            </p>
            <div className="flex gap-5">
              {[
                { icon: <Facebook className="h-6 w-6" />, href: '#' },
                { icon: <Instagram className="h-6 w-6" />, href: '#' },
                { icon: <Twitter className="h-6 w-6" />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="flex h-14 w-14 transform items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.03] text-zinc-500 shadow-2xl transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="grid grid-cols-2 gap-16 md:grid-cols-3 lg:col-span-8">
            {navGroups.map((group, i) => (
              <div key={i}>
                <h4 className="mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-50">
                  {group.title}
                </h4>
                <ul className="space-y-6">
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-lg font-bold text-zinc-500 transition-all hover:text-white"
                      >
                        <span className="transition-transform group-hover:translate-x-1">
                          {link.label}
                        </span>
                        <ArrowUpRight className="h-4 w-4 -translate-y-1 text-primary opacity-0 transition-all group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter & Contact */}
        <div className="group mb-32 flex flex-col items-center justify-between gap-12 rounded-[4rem] border border-white/5 bg-white/[0.02] p-12 transition-colors duration-700 hover:bg-white/[0.04] md:p-16 lg:flex-row">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="mb-4 text-3xl font-black tracking-tight text-white">
              {t.footer.newsletterTitle}
            </h3>
            <p className="text-lg font-medium text-zinc-500">
              {t.footer.newsletterSubtitle}
            </p>
          </div>
          <div className="flex w-full max-w-xl flex-1 flex-col items-center gap-4 sm:flex-row">
            <div className="group/input relative w-full flex-1">
              <Mail className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within/input:text-primary" />
              <input
                type="email"
                placeholder={t.footer.newsletterPlaceholder}
                className="w-full rounded-3xl border border-white/5 bg-zinc-950 py-6 pl-16 pr-6 text-lg font-bold text-white transition-all placeholder:text-zinc-700 focus:border-primary/50 focus:outline-none"
              />
            </div>
            <button className="h-20 w-full rounded-3xl bg-primary px-10 text-lg font-black text-white shadow-2xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 sm:w-auto">
              {t.footer.subscribe}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/[0.03] pt-12 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 md:flex-row">
          <p>
            © {new Date().getFullYear()} Slovor Marketplace. {t.footer.rights}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <span className="flex cursor-default items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.03] px-3 py-1.5 transition-colors hover:bg-white/[0.05]">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Slovakia / EUR
            </span>
            <div className="flex items-center gap-6 md:gap-8">
              <Link
                href="/terms"
                className="py-2 transition-colors hover:text-white"
              >
                {t.footer.transparency || 'Transparency'}
              </Link>
              <Link
                href="/privacy"
                className="py-2 transition-colors hover:text-white"
              >
                {t.footer.privacyPolicy || 'Privacy Policy'}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
