import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-primary mb-4 text-9xl font-bold">404</h1>
        <h2 className="text-foreground mb-4 text-4xl font-bold">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-md text-xl">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3 font-semibold transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/listings"
            className="border-border text-muted-foreground hover:bg-accent rounded-xl border-2 px-6 py-3 font-semibold transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
