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
import { Facebook, Instagram, Twitter, Mail, ArrowUpRight, ChevronDown } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES } from '@/lib/types/currency'

export function Footer() {
  const { t, locale } = useTranslation()
  const { currency, geoLocation, isLoading } = useCurrency()
  const [categories, setCategories] = useState<Category[]>([])
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.03] bg-zinc-950 pb-24 pt-16 text-zinc-400 md:pb-16 md:pt-24 lg:pt-32">
      {/* Decorative Elements - Hidden on mobile */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[150px] md:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-600/5 blur-[150px] md:block" />

      <Container className="relative z-10">
        <div className="mb-12 grid grid-cols-1 gap-8 md:mb-24 md:grid-cols-2 md:gap-12 lg:mb-32 lg:grid-cols-12 lg:gap-16">
          {/* Brand Info */}
          <div className="space-y-6 md:space-y-10 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3 md:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-violet-500 to-indigo-500 text-xl font-black text-white shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:rotate-6 md:h-12 md:w-12 md:rounded-2xl md:text-2xl">
                S
              </div>
              <span className="text-2xl font-black tracking-tighter text-white md:text-4xl">
                Slovor
                <span className="text-primary group-hover:animate-pulse">.</span>
              </span>
            </Link>
            <p className="max-w-xs text-base font-medium italic leading-relaxed text-zinc-500 md:max-w-sm md:text-xl">
              &ldquo;{t.footer.description}&rdquo;
            </p>
            <div className="flex gap-3 md:gap-5">
              {[
                { icon: <Facebook className="h-5 w-5 md:h-6 md:w-6" />, href: '#', label: 'Facebook' },
                { icon: <Instagram className="h-5 w-5 md:h-6 md:w-6" />, href: '#', label: 'Instagram' },
                { icon: <Twitter className="h-5 w-5 md:h-6 md:w-6" />, href: '#', label: 'Twitter' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-12 w-12 transform items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03] text-zinc-500 shadow-xl transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white md:h-14 md:w-14 md:rounded-2xl"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="lg:col-span-8">
            {/* Mobile Accordion */}
            <div className="space-y-2 md:hidden">
              {navGroups.map((group, i) => (
                <div key={i} className="border-b border-white/[0.05]">
                  <button
                    onClick={() => toggleSection(i)}
                    aria-expanded={openSection === i}
                    aria-controls={`footer-section-${i}`}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-sm font-black uppercase tracking-wider text-white/70">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-zinc-600 transition-transform",
                        openSection === i && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      openSection === i
                        ? "grid-rows-[1fr] pb-4"
                        : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3">
                        {group.links.map((link, j) => (
                          <li key={j}>
                            <Link
                              href={link.href}
                              className="block text-base font-bold text-zinc-500 transition-colors hover:text-white"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden grid-cols-3 gap-8 md:grid lg:gap-16">
              {navGroups.map((group, i) => (
                <div key={i}>
                  <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-50 lg:mb-10">
                    {group.title}
                  </h4>
                  <ul className="space-y-4 lg:space-y-6">
                    {group.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-base font-bold text-zinc-500 transition-all hover:text-white lg:text-lg"
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
        </div>

        {/* Newsletter */}
        <div className="group mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-colors duration-700 hover:bg-white/[0.04] md:mb-24 md:gap-10 md:rounded-[2rem] md:p-10 lg:mb-32 lg:flex-row lg:p-12">
          <div className="w-full text-center lg:max-w-md lg:text-left">
            <h3 className="mb-2 text-lg font-black tracking-tight text-white md:mb-3 md:text-2xl lg:text-3xl">
              {t.footer.newsletterTitle}
            </h3>
            <p className="text-sm font-medium text-zinc-500 md:text-base">
              {t.footer.newsletterSubtitle}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:max-w-lg lg:flex-row lg:gap-4">
            <div className="group/input relative flex-1">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within/input:text-primary" />
              <input
                type="email"
                placeholder={t.footer.newsletterPlaceholder}
                className="w-full rounded-xl border border-white/5 bg-zinc-950 py-4 pl-12 pr-4 text-base font-bold text-white transition-all placeholder:text-zinc-700 focus:border-primary/50 focus:outline-none"
              />
            </div>
            <button className="h-14 w-full shrink-0 rounded-xl bg-primary px-6 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 lg:w-auto lg:px-8">
              {t.footer.subscribe}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.03] pt-6 md:pt-10">
          {/* Mobile: Vertical stack */}
          <div className="flex flex-col items-center gap-4 text-center md:hidden">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider" suppressHydrationWarning>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {mounted && !isLoading ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency]?.code || 'EUR'}` : '...'}
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-600" suppressHydrationWarning>
              © {new Date().getFullYear()} Slovor Marketplace. {t.footer.rights}.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-[10px] font-black uppercase tracking-wider text-zinc-600 transition-colors hover:text-white"
              >
                {t.footer.transparency || 'Transparency'}
              </Link>
              <Link
                href="/privacy"
                className="text-[10px] font-black uppercase tracking-wider text-zinc-600 transition-colors hover:text-white"
              >
                {t.footer.privacyPolicy || 'Privacy Policy'}
              </Link>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden items-center justify-between md:flex">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600" suppressHydrationWarning>
              © {new Date().getFullYear()} Slovor Marketplace. {t.footer.rights}.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex h-7 items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.03] px-3 text-[10px] font-black uppercase tracking-wider" suppressHydrationWarning>
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {mounted && !isLoading ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency]?.code || 'EUR'}` : '...'}
              </span>
              <Link
                href="/terms"
                className="flex h-7 items-center text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-white"
              >
                {t.footer.transparency || 'Transparency'}
              </Link>
              <Link
                href="/privacy"
                className="flex h-7 items-center text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-white"
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
