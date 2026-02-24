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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES } from '@/lib/types/currency'

import { Logo } from '@/components/ui/logo'

export function Footer() {
  const { t, i18n } = useTranslation(['common', 'footer', 'categories'])

  const locale = i18n.language
  const { currency, geoLocation, isLoading } = useCurrency()
  const [categories, setCategories] = useState<Category[]>([])
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [dynamicPages, setDynamicPages] = useState<StaticPage[]>([])
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error(
        t('footer:subscribeError') || 'Please enter a valid email address.'
      )
      return
    }

    setIsSubmitting(true)
    try {
      // Simulation of API request
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success(
        t('footer:subscribeSuccess') ||
        'Successfully subscribed to our newsletter!'
      )
      setEmail('')
    } catch (error) {
      toast.error(t('common:error.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setMounted(true)

    // Initial data fetch
    const fetchData = async () => {
      try {
        const [catRes, blogRes, pagesRes] = await Promise.all([
          categoriesApi.getAll(),
          blogApi.listPosts({ limit: 4 }),
          pagesApi.getAll(),
        ])

        if (catRes.data) setCategories(catRes.data)
        if (blogRes.data) setLatestPosts(blogRes.data)
        if (pagesRes.data) setDynamicPages(pagesRes.data)
      } catch (err) {
        console.error('Footer data fetch failed:', err)
      }
    }

    fetchData()
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
      title: t('common:marketTrends') || 'News & Tips',
      links:
        latestPosts.length > 0
          ? latestPosts.map((post) => ({
            label: post.title,
            href: `/${locale}/blog/${post.slug}`,
          }))
          : [
            { label: t('common:sellingTips'), href: `/${locale}/blog` },
            { label: t('common:safetyGuide'), href: `/${locale}/blog` },
            { label: t('common:marketTrends'), href: `/${locale}/blog` },
          ],
    },
    {
      title: t('footer:info'),
      links: [
        { label: t('footer:about'), href: `/${locale}/about` },
        {
          label: t('footer:contact') || 'Contact Us',
          href: `/${locale}/contact`,
        },
        ...dynamicPages
          .filter(
            (p) =>
              !['about', 'contact', 'terms', 'privacy', 'faq'].includes(p.slug)
          )
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

  // if (!mounted) return null (Removed to fix CLS)

  // Global footer used everywhere

  return (
    <footer className="bg-card border-border border-t pt-20 pb-20 antialiased md:pt-28 md:pb-12">
      {/* Decorative background grid */}
      <div className="bg-grid-slate-200/50 mask-[linear-gradient(to_bottom,white,transparent)] absolute inset-0 opacity-10" />

      <Container className="relative z-10">
        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand Info */}
          <div className="flex flex-col items-center space-y-8 text-center lg:col-span-4 lg:items-start lg:text-left">
            <div className="transition-transform hover:scale-105 duration-500">
              <Logo size="lg" />
            </div>
            <p className="text-muted-foreground max-w-sm text-lg leading-relaxed font-medium transition-colors hover:text-foreground/80">
              {t('footer:description')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com/slovor', label: 'Facebook' },
                { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com/slovor', label: 'Instagram' },
                { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/slovor', label: 'Twitter' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="social-icon-btn group flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground transition-all duration-500 hover:bg-primary hover:text-white hover:scale-110 active:scale-90 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="lg:col-span-8">
            <div className="hidden grid-cols-3 gap-12 md:grid">
              {navGroups.map((group, i) => (
                <div key={i} className="space-y-8">
                  <h4 className="text-foreground text-[11px] font-black tracking-[0.3em] uppercase opacity-70">
                    {group.title}
                  </h4>
                  <ul className="space-y-4">
                    {group.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.href}
                          className="group text-foreground/60 hover:text-primary flex items-center gap-2 text-base font-bold transition-all duration-300"
                        >
                          <span className="bg-primary/0 group-hover:bg-primary h-1.5 w-0 rounded-full transition-all group-hover:w-1.5" />
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
            <div className="space-y-3 md:hidden">
              {navGroups.map((group, i) => (
                <div key={i} className="border-border overflow-hidden border rounded-2xl">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(i)}
                    className="flex h-auto w-full items-center justify-between px-5 py-6 text-left hover:bg-white/5"
                  >
                    <span className="text-foreground text-sm font-black tracking-widest uppercase">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        'text-muted-foreground h-5 w-5 transition-transform duration-500',
                        openSection === i && 'rotate-180 text-primary'
                      )}
                    />
                  </Button>
                  <div
                    className={cn(
                      'grid transition-all duration-500 ease-out-expo',
                      openSection === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-4 px-5 pb-6">
                        {group.links.map((link, j) => (
                          <li key={j}>
                            <Link
                              href={link.href}
                              className="text-foreground/60 hover:text-primary flex items-center gap-3 text-base font-bold"
                            >
                              <div className="bg-primary h-1.5 w-1.5 rounded-full opacity-40" />
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

        {/* Newsletter - PRO MAX */}
        <div className="group relative mb-20 flex flex-col items-center justify-between gap-8 rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-700 hover:border-primary/30 md:mb-24 md:p-12 lg:flex-row lg:p-14">
          <div className="bg-primary/5 absolute -inset-1 rounded-2xl blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-30" />

          <div className="relative z-10 w-full text-center lg:max-w-md lg:text-left">
            <h3 className="text-foreground mb-4 text-3xl font-black tracking-tight lg:text-4xl">
              {t('footer:newsletterTitle')}
            </h3>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              {t('footer:newsletterSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="relative z-10 flex w-full flex-col gap-4 lg:max-w-md lg:flex-row">
            <div className="relative flex-1">
              <Mail className="text-muted-foreground absolute top-1/2 left-5 z-10 h-6 w-6 -translate-y-1/2 transition-colors group-focus-within:text-primary" />
              <Input
                type="email"
                required
                placeholder={t('footer:newsletterPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-input bg-card text-foreground placeholder:text-muted-foreground h-16 w-full rounded-xl py-6 pr-6 pl-14 text-lg font-bold transition-all focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="shadow-primary/20 h-16 w-full shrink-0 rounded-xl px-10 text-lg font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95 lg:w-auto"
            >
              {isSubmitting ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                t('footer:subscribe')
              )}
            </Button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="border-border/40 border-t pt-10">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <p className="text-muted-foreground text-[11px] font-black tracking-[0.2em] uppercase opacity-60">
              © {new Date().getFullYear()} Slovor Marketplace. {t('footer:rights')}.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <span className="border-border bg-muted/50 flex h-8 items-center gap-3 rounded-full border px-4 text-[10px] font-black tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {mounted && !isLoading
                  ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency]?.code || 'EUR'}`
                  : '...'}
              </span>

              <div className="flex gap-6">
                {[
                  { label: t('footer:transparency') || 'Transparency', href: `/${locale}/terms`, id: 'footer-terms-link' },
                  { label: t('footer:privacyPolicy') || 'Privacy Policy', href: `/${locale}/privacy`, id: 'footer-privacy-link' },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="text-foreground/40 hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors"
                    data-testid={link.id}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
