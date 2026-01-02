import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mx-auto mb-8 max-w-md text-xl text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Go Home
          </Link>
          <Link
            href="/listings"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
