'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export function SearchBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'en'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/${locale}/listings?search=${encodeURIComponent(search.trim())}`)
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
          className="border-input bg-muted/30 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-6 py-4 pr-32 text-lg shadow-sm transition-all focus:ring-1 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 absolute top-1/2 right-2 -translate-y-1/2 rounded-xl px-6 py-2 font-semibold transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}
