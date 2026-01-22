import type { Metadata } from 'next'
import { Inter, Jost, Bodoni_Moda } from 'next/font/google'
import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from './providers'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' })
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni' })

export const metadata: Metadata = {
  title: 'Slovor Marketplace - Slovakia Classifieds',
  description:
    'The modern marketplace for Slovakia. Buy and sell electronics, cars, real estate, and more locally.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="sk"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(inter.variable, jost.variable, bodoni.variable)}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased'
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Suspense
              fallback={
                <div className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md" />
              }
            >
              <Header />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
