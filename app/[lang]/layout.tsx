import type { Metadata } from 'next'
import { DM_Sans, Outfit } from 'next/font/google'
import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '../providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../globals.css'
import { cn } from '@/lib/utils'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

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
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${outfit.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <meta name="theme-color" content="#6366f1" />
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
        <Providers lang={lang}>
          <div className="relative flex min-h-screen flex-col">
            <Suspense
              fallback={
                <div className="bg-background/80 h-16 border-b border-white/5 backdrop-blur-md" />
              }
            >
              <Header />
            </Suspense>
            <main className="flex-1 pb-24 md:pb-0">{children}</main>
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
