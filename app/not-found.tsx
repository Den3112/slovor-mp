import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-4xl font-bold text-foreground">
          Page Not Found
        </h2>
        <p className="mx-auto mb-8 max-w-md text-xl text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go Home
          </Link>
          <Link
            href="/listings"
            className="rounded-xl border-2 border-border px-6 py-3 font-semibold text-muted-foreground transition-colors hover:bg-accent"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
