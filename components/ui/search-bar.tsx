'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/listings?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products, services..."
          className="w-full rounded-xl border border-input bg-muted/30 px-6 py-4 pr-32 text-lg shadow-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </div>
    </form>
  )
}
