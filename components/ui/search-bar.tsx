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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products, services..."
          className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none shadow-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}
