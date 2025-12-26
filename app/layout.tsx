import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Suspense } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from './providers'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Slovor Marketplace - Slovakia Classifieds',
  description: 'The modern marketplace for Slovakia. Buy and sell electronics, cars, real estate, and more locally.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} dark`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased text-foreground", inter.className)}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-16 bg-background/80 backdrop-blur-md border-b border-white/5" />}>
              <Header />
            </Suspense>
            <main className="flex-1 transition-all duration-300">{children}</main>
            <Footer />
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
