import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Slovor
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/listings"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              All Listings
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
