import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from './providers'
import './globals.css'

import { categoriesApi } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Slovor Marketplace - Buy & Sell Anything',
  description: 'Marketplace for buying and selling goods and services. Electronics, vehicles, real estate and more.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: categories } = await categoriesApi.getAll()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Prevent automatic translation - we handle it ourselves */}
        <meta name="google" content="notranslate" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header categories={categories || []} />
          <main className="flex-1">{children}</main>
          <Footer categories={categories || []} />
        </Providers>
      </body>
    </html>
  )
}
