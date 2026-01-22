'use client'

import { useEffect, useState } from 'react'
import { categoriesApi } from '@/lib/api'
import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { useCurrency } from '@/components/providers/currency-provider'
import { Container } from '@/components/ui/container'
import { getLocalizedCategoryName, getUniqueCategories } from '@/lib/utils/category-i18n'

import { FooterBrand } from './footer/footer-brand'
import { FooterNav } from './footer/footer-nav'
import { FooterNewsletter } from './footer/footer-newsletter'
import { FooterBottom } from './footer/footer-bottom'

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
      links: topCategories.map((cat: Category) => ({
        label: getLocalizedCategoryName(cat, locale, t),
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
          <FooterBrand description={t.footer.description} />
          <FooterNav
            navGroups={navGroups}
            openSection={openSection}
            toggleSection={toggleSection}
          />
        </div>

        <FooterNewsletter t={t} />

        <FooterBottom
          t={t}
          mounted={mounted}
          isLoading={isLoading}
          currency={currency}
          geoLocation={geoLocation}
        />
      </Container>
    </footer>
  )
}
