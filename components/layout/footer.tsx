'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { categoriesApi, blogApi, pagesApi } from '@/lib/api'
import type { Category, BlogPost, StaticPage } from '@/lib/types/database'
import {
  getUniqueCategories,
  getLocalizedCategoryName,
} from '@/lib/utils/category-i18n'
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  ChevronDown,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES } from '@/lib/types/currency'

export function Footer() {
  const { t, i18n } = useTranslation(['common', 'footer'])
  const pathname = usePathname()
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
      pagesApi.getAll()
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
      title: t('footer.popular'),
      links: topCategories.map((cat) => ({
        label: getLocalizedCategoryName(cat, locale, t),
        href: `/${locale}/categories/${cat.slug}`,
      })),
    },
    {
      title: t('marketTrends') || 'News & Tips',
      links: latestPosts.length > 0
        ? latestPosts.map(post => ({ label: post.title, href: `/${locale}/blog/${post.slug}` }))
        : [
          { label: 'Selling Tips', href: `/${locale}/blog` },
          { label: 'Safety Guide', href: `/${locale}/blog` },
          { label: 'Market Trends', href: `/${locale}/blog` },
        ],
    },
    {
      title: t('footer.info'),
      links: [
        { label: t('footer.about'), href: `/${locale}/about` },
        ...dynamicPages.filter(p => !['about', 'terms', 'privacy', 'faq'].includes(p.slug)).map(p => ({
          label: p.title,
          href: `/${locale}/${p.slug}`
        })),
        { label: t('footer.faq'), href: `/${locale}/faq` },
        { label: t('footer.terms'), href: `/${locale}/terms` },
        { label: t('footer.privacy'), href: `/${locale}/privacy` },
      ],
    },
  ]

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  if (!mounted) return null

  const isDashboard = pathname?.includes('/admin') || pathname?.includes('/dashboard') || pathname?.includes('/messages') || pathname?.includes('/favorites')

  if (isDashboard) {
    return (
      <footer className="border-t border-border bg-background pt-8 pb-20 md:py-8 text-muted-foreground">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              © {new Date().getFullYear()} Slovor Marketplace. {t('footer.rights')}.
            </p>
            <div className="flex gap-4">
              <Link
                href={`/${locale}/terms`}
                className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase hover:text-primary"
                data-testid="footer-dashboard-terms"
              >
                {t('footer.transparency') || 'Transparency'}
              </Link>
              <Link
                href={`/${locale}/privacy`}
                className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase hover:text-primary"
                data-testid="footer-dashboard-privacy"
              >
                {t('footer.privacyPolicy') || 'Privacy Policy'}
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    )
  }

  return (
    <footer className="border-t border-border bg-muted/30 pt-16 pb-20 text-muted-foreground md:pt-20 md:pb-12">
      <Container>
        <div className="mb-12 grid grid-cols-1 gap-8 md:mb-16 md:grid-cols-2 md:gap-12 lg:mb-20 lg:grid-cols-12 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-6 lg:col-span-4">
            <Link
              href={`/${locale}`}
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200 transition-transform duration-500 group-hover:rotate-6 md:h-11 md:w-11 md:rounded-xl">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                Slovor
                <span className="text-primary group-hover:animate-pulse">.</span>
              </span>
            </Link>
            <p className="max-w-xs text-base leading-relaxed font-medium text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
                { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
                { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
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
                  <h4 className="mb-6 text-[11px] font-bold tracking-widest text-foreground uppercase">
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
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
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => toggleSection(i)}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-muted-foreground transition-transform',
                        openSection === i && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      openSection === i ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3">
                        {group.links.map((link, j) => (
                          <li key={j}>
                            <Link
                              href={link.href}
                              className="block text-base font-medium text-muted-foreground hover:text-primary"
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
        <div className="group mb-12 flex flex-col items-center justify-between gap-6 rounded-xl border border-border bg-card p-6 shadow-sm transition-colors duration-500 md:mb-16 md:gap-8 md:p-8 lg:mb-20 lg:flex-row lg:p-10">
          <div className="w-full text-center lg:max-w-md lg:text-left">
            <h3 className="mb-2 text-xl font-bold text-foreground md:text-2xl">
              {t('footer.newsletterTitle')}
            </h3>
            <p className="text-base font-medium text-muted-foreground">
              {t('footer.newsletterSubtitle')}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:max-w-md lg:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="w-full rounded-xl border border-input bg-background/50 py-3.5 pr-4 pl-11 text-base font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 h-12 w-full shrink-0 rounded-xl px-6 text-base font-bold text-primary-foreground shadow-md transition-all active:scale-95 lg:w-auto">
              {t('footer.subscribe')}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              © {new Date().getFullYear()} Slovor Marketplace. {t('footer.rights')}.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex h-6 items-center gap-2 rounded-lg bg-muted px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border/50">
                <div className="h-1.5 w-1.5 rounded-sm bg-emerald-500" />
                {mounted && !isLoading
                  ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency]?.code || 'EUR'}`
                  : '...'}
              </span>
              <div className="flex gap-4">
                <Link
                  href={`/${locale}/terms`}
                  className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase hover:text-primary"
                  data-testid="footer-terms-link"
                >
                  {t('footer.transparency') || 'Transparency'}
                </Link>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase hover:text-primary"
                  data-testid="footer-privacy-link"
                >
                  {t('footer.privacyPolicy') || 'Privacy Policy'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
