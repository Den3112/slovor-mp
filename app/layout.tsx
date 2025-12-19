import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Slovor - Marketplace',
  description: 'Buy and sell anything in Slovakia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
