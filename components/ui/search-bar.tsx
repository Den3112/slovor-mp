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
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-4 md:px-0">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for listings, services..."
          className="w-full border-2 border-primary/10 bg-zinc-950/80 px-8 py-5 pr-40 font-sans text-sm font-bold text-white transition-all placeholder:text-zinc-700 outline-none focus:border-primary focus:bg-zinc-950 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)]"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary px-8 py-3 font-sans text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-primary/90 hover:-translate-y-[calc(50%+2px)] active:-translate-y-1/2"
        >
          Search
        </button>
      </div>
    </form>
  )
}
