import type { Metadata, Viewport } from 'next'
import { StructuredData } from '@/widgets/structured-data'
import { Providers } from '../providers'
import dynamic from 'next/dynamic'
import { config } from '@/shared/lib/config'

const GlobalCommandPalette = dynamic(() =>
  import('@/features/vantage').then((mod) => mod.GlobalCommandPalette)
)
// import { Analytics } from '@vercel/analytics/react'
// import { SpeedInsights } from '@vercel/speed-insights/next'
import '../globals.css'
import { cn } from '@/shared/lib/utils'

/*
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
*/
const inter = { variable: 'font-sans' }
const jetBrainsMono = { variable: 'font-mono' }

export const viewport: Viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export function generateStaticParams() {
  return [{ lang: 'sk' }, { lang: 'en' }, { lang: 'cs' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params

  const titles: Record<string, string> = {
    en: 'Slovor - Premium Marketplace in Slovakia',
    sk: 'Slovor - Prémiový bazár na Slovensku',
    cs: 'Slovor - Premiový bazar na Slovensku',
  }

  const descriptions: Record<string, string> = {
    en: 'Buy and sell electronics, real estate, cars and more. The most advanced marketplace for Slovakia.',
    sk: 'Kupujte a predávajte elektroniku, nehnuteľnosti, autá a viac. Najmodernejší bazár na Slovensku.',
    cs: 'Kupujte a prodávejte elektroniku, nemovitosti, auta a více. Nejmodernější bazar na Slovensku.',
  }

  const defaultTitle =
    titles[lang] || titles.en || 'Slovor - Premium Marketplace in Slovakia'
  const defaultDescription = descriptions[lang] || descriptions.en

  return {
    title: {
      default: defaultTitle,
      template: `%s | Slovor`,
    },
    description: defaultDescription,
    metadataBase: new URL(config.site.url),
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
      locale: lang === 'en' ? 'en_US' : lang === 'sk' ? 'sk_SK' : 'cs_CZ',
      url: `/${lang}`,
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
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
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
        <Providers lang={lang}>
          <StructuredData locale={lang} />
          <GlobalCommandPalette />
          {children}
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </Providers>
      </body>
    </html>
  )
}
