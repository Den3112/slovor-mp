import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Slovor Marketplace
          </Link>
          <div className="flex gap-4">
            <Link href="/listings" className="hover:underline">
              All Listings
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
