import { Metadata } from 'next'

const SITE_CONFIG = {
  name: 'Slovor Marketplace',
  description:
    'Prémiový bazár a маркетплейс na Slovensku. Nakupujte a predávajte bezpečne.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://slovor.sk',
  ogImage: '/og-image.jpg',
  twitterHandle: '@slovor_sk',
}

interface GenerateMetadataProps {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  author?: string
}

export function generateSeoMetadata({
  title,
  description,
  image,
  path = '',
  type = 'website',
  publishedTime,
  author,
}: GenerateMetadataProps): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name
  const fullDescription = description || SITE_CONFIG.description
  const url = `${SITE_CONFIG.url}${path}`
  const ogImage = image || SITE_CONFIG.ogImage

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: url,
      languages: {
        'sk-SK': `${SITE_CONFIG.url}/sk${path}`,
        'en-US': `${SITE_CONFIG.url}/en${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'sk_SK',
      type: type === 'product' ? 'website' : type,
      ...(publishedTime && { publishedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  }
}

export function generateJsonLd(
  type: 'Product' | 'Organization' | 'WebSite',
  data: any
) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  if (type === 'Product') {
    return {
      ...base,
      name: data.title,
      image: data.images,
      description: data.description,
      brand: {
        '@type': 'Brand',
        name: data.brand || SITE_CONFIG.name,
      },
      offers: {
        '@type': 'Offer',
        url: `${SITE_CONFIG.url}/inzerat/${data.id}`,
        priceCurrency: 'EUR',
        price: data.price,
        itemCondition: 'https://schema.org/UsedCondition',
        availability: 'https://schema.org/InStock',
      },
    }
  }

  if (type === 'Organization') {
    return {
      ...base,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/logo.png`,
      sameAs: ['https://facebook.com/slovor', 'https://instagram.com/slovor'],
    }
  }

  return base
}
