// Header Component
// Simple navigation (Principle #1, #6)

import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Slovor
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/listings"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              All Listings
            </Link>
            <Link
              href="/listings/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Post Ad
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
