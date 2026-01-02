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
          className="w-full rounded-full border-2 border-gray-200 px-6 py-4 pr-32 text-lg shadow-lg focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  )
}
