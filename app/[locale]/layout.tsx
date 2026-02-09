import type { Metadata, Viewport } from 'next'
import { StructuredData } from '@/components/layout/structured-data'
import { Providers } from '../providers'
import { GlobalCommandPalette } from '@/components/features/vantage/command-palette'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../globals.css'
import { cn } from '@/lib/utils'

// Fallback system fonts to bypass next/font/google build issues in some environments
const fontHeading = "'Inter', 'Inter var', system-ui, -apple-system, sans-serif"
const fontSans = "'Inter', 'Inter var', system-ui, -apple-system, sans-serif"
const fontMono =
  "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"

export const viewport: Viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: "Slovor - Premium Marketplace in Slovakia",
    sk: "Slovor - Prémiový bazár na Slovensku",
    cs: "Slovor - Premiový bazar na Slovensku",
    ru: "Slovor - Премиум маркетплейс в Словакии"
  }

  const descriptions: Record<string, string> = {
    en: "Buy and sell electronics, real estate, cars and more. The most advanced marketplace for Slovakia.",
    sk: "Kupujte a predávajte elektroniku, nehnuteľnosti, autá a viac. Najmodernejší bazár na Slovensku.",
    cs: "Kupujte a prodávejte elektroniku, nemovitosti, auta a více. Nejmodernější bazar na Slovensku.",
    ru: "Покупайте и продавайте электронику, недвижимость, автомобили и многое другое. Самый современный маркетплейс в Словакии."
  }

  const defaultTitle = titles[locale] || titles.en || "Slovor - Premium Marketplace in Slovakia";
  const defaultDescription = descriptions[locale] || descriptions.en;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
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
      title: 'Slovor Marketplace',
      description: 'The modern marketplace for Slovakia.',
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
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      style={
        {
          // @ts-ignore
          '--font-heading': fontHeading,
          '--font-sans': fontSans,
          '--font-mono': fontMono,
        } as React.CSSProperties
      }
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased'
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
