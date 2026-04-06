'use client'

import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/shared/lib/constants/nav-links'
import { useTranslation } from '@/shared/lib/i18n'
import { useMounted } from '@/shared/lib/hooks/use-mounted'

interface StructuredDataProps {
  locale: string
  extraSchema?: any
  nonce?: string
}

export function StructuredData({
  locale,
  extraSchema,
  nonce,
}: StructuredDataProps) {
  const pathname = usePathname()
  const { t } = useTranslation('common')
  const isMounted = useMounted()

  if (!isMounted) return null

  // 1. BreadcrumbList Schema
  // We extract segments from pathname to build breadcrumbs
  const segments = pathname?.split('/').filter(Boolean).slice(1) || [] // Remove locale
  const breadcrumbs = segments.map((segment, index) => {
    const url = `/${locale}/${segments.slice(0, index + 1).join('/')}`

    // Attempt to find a label in NAV_LINKS or fallback to title case
    let label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    // Check main nav
    const mainMatch = NAV_LINKS.main.find((l) => l.href === `/${segment}`)
    if (mainMatch) label = t(mainMatch.label)

    // Check categories
    const catMatch = NAV_LINKS.categories.find((c) => c.href.includes(segment))
    if (catMatch) label = t(catMatch.label)

    return {
      name: label,
      item: `${process.env.NEXT_PUBLIC_APP_URL || ''}${url}`,
    }
  })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((bc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: bc.name,
      item: bc.item,
    })),
  }

  // 2. SiteNavigationElement Schema
  const navSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: NAV_LINKS.main.map((l) => t(l.label)),
    url: NAV_LINKS.main.map(
      (l) => `${process.env.NEXT_PUBLIC_APP_URL || ''}/${locale}${l.href}`
    ),
  }

  // 3. Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Slovor Marketplace',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://slovor.sk',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://slovor.sk'}/logo.png`,
    sameAs: [
      'https://www.facebook.com/slovor',
      'https://www.instagram.com/slovor',
    ],
  }

  return (
    <>
      {breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {extraSchema && (
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(extraSchema) }}
        />
      )}
    </>
  )
}
