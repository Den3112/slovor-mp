import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { StructuredData } from '@/components/layout/structured-data'
import { Providers } from '../providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../globals.css'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Slovor Marketplace - Slovakia Classifieds',
    template: '%s | Slovor Marketplace',
  },
  description:
    'The modern marketplace for Slovakia. Buy and sell electronics, cars, real estate, and more locally.',
  metadataBase: new URL('https://slovor.sk'),
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: '/',
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
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <meta name="theme-color" content="#3B82F6" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased'
        )}
      >
        <Providers lang={locale}>
          <StructuredData locale={locale} />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
