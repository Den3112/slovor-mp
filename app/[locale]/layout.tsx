import type { Metadata, Viewport } from 'next'
import { StructuredData } from '@/components/layout/structured-data'
import { Providers } from '../providers'
import { GlobalCommandPalette } from '@/components/features/vantage/command-palette'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../globals.css'
import { cn } from '@/lib/utils'

import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-mono',
})

export const viewport: Viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Slovor - Premium Marketplace in Slovakia',
    sk: 'Slovor - Prémiový bazár na Slovensku',
    cs: 'Slovor - Premiový bazar na Slovensku',
    ru: 'Slovor - Премиум маркетплейс в Словакии',
  }

  const descriptions: Record<string, string> = {
    en: 'Buy and sell electronics, real estate, cars and more. The most advanced marketplace for Slovakia.',
    sk: 'Kupujte a predávajte elektroniku, nehnuteľnosti, autá a viac. Najmodernejší bazár na Slovensku.',
    cs: 'Kupujte a prodávejte elektroniku, nemovitosti, auta a více. Nejmodernější bazar na Slovensku.',
    ru: 'Покупайте и продавайте электронику, недвижимость, автомобили и многое другое. Самый современный маркетплейс в Словакии.',
  }

  const defaultTitle =
    titles[locale] || titles.en || 'Slovor - Premium Marketplace in Slovakia'
  const defaultDescription = descriptions[locale] || descriptions.en

  return {
    title: {
      default: defaultTitle,
      template: `%s | Slovor`,
    },
    description: defaultDescription,
    metadataBase: new URL('https://slovor.sk'),
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      shortcut: '/logo-icon.png',
      apple: '/apple-touch-icon.png',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Slovor',
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'sk_SK',
      url: `/${locale}`,
      siteName: 'Slovor',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Slovor Marketplace',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: ['/og-image.png'],
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased',
          inter.variable,
          jetBrainsMono.variable,
          '--font-heading'
        )}
      >
        <Providers lang={locale}>
          <StructuredData locale={locale} />
          <GlobalCommandPalette />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
