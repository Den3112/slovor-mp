'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { categoriesApi, blogApi, pagesApi } from '@/lib/api'
import type { Category, BlogPost, StaticPage } from '@/lib/types/database'
import {
  getUniqueCategories,
  getLocalizedCategoryName,
} from '@/lib/utils/category-i18n'
import { Facebook, Instagram, Twitter, Mail, ChevronDown } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES } from '@/lib/types/currency'

import { Logo } from '@/components/ui/logo'

export function Footer() {
  const { t, i18n } = useTranslation(['common', 'footer'])

  const locale = i18n.language
  const { currency, geoLocation, isLoading } = useCurrency()
  const [categories, setCategories] = useState<Category[]>([])
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [dynamicPages, setDynamicPages] = useState<StaticPage[]>([])
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    Promise.all([
      categoriesApi.getAll(),
      blogApi.listPosts({ limit: 4 }),
      pagesApi.getAll(),
    ]).then(([catRes, blogRes, pagesRes]) => {
      if (catRes.data) setCategories(catRes.data)
      if (blogRes.data) setLatestPosts(blogRes.data)
      if (pagesRes.data) setDynamicPages(pagesRes.data)
    })
  }, [])

  const uniqueCategories = getUniqueCategories(categories, locale, t)
  const topCategories = uniqueCategories.slice(0, 5)

  const navGroups = [
    {
      title: t('footer:popular'),
      links: topCategories.map((cat) => ({
        label: getLocalizedCategoryName(cat, locale, t),
        href: `/${locale}/categories/${cat.slug}`,
      })),
    },
    {
      title: t('marketTrends') || 'News & Tips',
      links:
        latestPosts.length > 0
          ? latestPosts.map((post) => ({
            label: post.title,
            href: `/${locale}/blog/${post.slug}`,
          }))
          : [
            { label: 'Selling Tips', href: `/${locale}/blog` },
            { label: 'Safety Guide', href: `/${locale}/blog` },
            { label: 'Market Trends', href: `/${locale}/blog` },
          ],
    },
    {
      title: t('footer:info'),
      links: [
        { label: t('footer:about'), href: `/${locale}/about` },
        { label: t('footer:contact') || 'Contact Us', href: `/${locale}/contact` },
        ...dynamicPages
          .filter((p) => !['about', 'contact', 'terms', 'privacy', 'faq'].includes(p.slug))
          .map((p) => ({
            label: p.title,
            href: `/${locale}/${p.slug}`,
          })),
        { label: t('footer:faq'), href: `/${locale}/faq` },
        { label: t('footer:terms'), href: `/${locale}/terms` },
        { label: t('footer:privacy'), href: `/${locale}/privacy` },
      ],
    },
  ]

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  if (!mounted) return null

  // Global footer used everywhere

  return (
    <footer className="border-border bg-muted/30 text-muted-foreground border-t pt-16 pb-32 md:pt-20 md:pb-12">
      <Container>
        <div className="mb-12 grid grid-cols-1 gap-8 md:mb-16 md:grid-cols-2 md:gap-12 lg:mb-20 lg:grid-cols-12 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-6 lg:col-span-4">
            <Logo size="lg" />
            <p className="text-muted-foreground max-w-xs text-base leading-relaxed font-medium">
              {t('footer:description')}
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: <Facebook className="h-5 w-5" />,
                  href: '#',
                  label: 'Facebook',
                },
                {
                  icon: <Instagram className="h-5 w-5" />,
                  href: '#',
                  label: 'Instagram',
                },
                {
                  icon: <Twitter className="h-5 w-5" />,
                  href: '#',
                  label: 'Twitter',
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-all hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="lg:col-span-8">
            <div className="hidden grid-cols-3 gap-8 md:grid lg:gap-12">
              {navGroups.map((group, i) => (
                <div key={i}>
                  <h4 className="text-foreground mb-6 text-[11px] font-bold tracking-widest uppercase">
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.href}
                          className="group text-muted-foreground hover:text-primary flex items-center gap-1.5 text-base font-medium transition-colors"
                        >
                          <span className="transition-transform group-hover:translate-x-1">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mobile Accordion */}
            <div className="space-y-2 md:hidden">
              {navGroups.map((group, i) => (
                <div key={i} className="border-border border-b">
                  <button
                    onClick={() => toggleSection(i)}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-foreground text-sm font-bold tracking-wider uppercase">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        'text-muted-foreground h-5 w-5 transition-transform',
                        openSection === i && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      openSection === i
                        ? 'grid-rows-[1fr] pb-4'
                        : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3">
                        {group.links.map((link, j) => (
                          <li key={j}>
                            <Link
                              href={link.href}
                              className="text-muted-foreground hover:text-primary block text-base font-medium"
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
          </div>
        </div>

        {/* Newsletter */}
        <div className="group border-border bg-card mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border p-6 shadow-sm transition-colors duration-500 md:mb-16 md:gap-8 md:p-8 lg:mb-20 lg:flex-row lg:p-10">
          <div className="w-full text-center lg:max-w-md lg:text-left">
            <h3 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
              {t('footer:newsletterTitle')}
            </h3>
            <p className="text-muted-foreground text-base font-medium">
              {t('footer:newsletterSubtitle')}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:max-w-md lg:flex-row">
            <div className="relative flex-1">
              <Mail className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <input
                type="email"
                placeholder={t('footer:newsletterPlaceholder')}
                className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary w-full rounded-lg border py-3.5 pr-4 pl-11 text-base font-medium focus:ring-1 focus:outline-none"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full shrink-0 rounded-lg px-6 text-base font-bold shadow-md transition-all active:scale-95 lg:w-auto">
              {t('footer:subscribe')}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              © {new Date().getFullYear()} Slovor Marketplace.{' '}
              {t('footer:rights')}.
            </p>
            <div className="flex items-center gap-6">
              <span className="bg-muted text-muted-foreground border-border/50 flex h-6 items-center gap-2 rounded-lg border px-3 text-[10px] font-bold tracking-wider uppercase">
                <div className="h-1.5 w-1.5 rounded-sm bg-emerald-500" />
                {mounted && !isLoading
                  ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency]?.code || 'EUR'}`
                  : '...'}
              </span>
              <div className="flex gap-4">
                <Link
                  href={`/${locale}/terms`}
                  className="text-muted-foreground hover:text-primary text-[10px] font-bold tracking-wider uppercase"
                  data-testid="footer-terms-link"
                >
                  {t('footer:transparency') || 'Transparency'}
                </Link>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-muted-foreground hover:text-primary text-[10px] font-bold tracking-wider uppercase"
                  data-testid="footer-privacy-link"
                >
                  {t('footer:privacyPolicy') || 'Privacy Policy'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
