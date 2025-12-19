import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/listings"
            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
