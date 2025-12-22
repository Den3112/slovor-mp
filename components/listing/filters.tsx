'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export function ListingFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [location, setLocation] = useState(searchParams.get('location') || 'all')

  const locations = [
    'Bratislava', 'Košice', 'Žilina', 'Prešov', 'Nitra', 'Trnava', 'Trenčín', 'Banská Bystrica'
  ]

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceMin) params.set('priceMin', priceMin)
    else params.delete('priceMin')

    if (priceMax) params.set('priceMax', priceMax)
    else params.delete('priceMax')

    if (sortBy !== 'newest') params.set('sort', sortBy)
    else params.delete('sort')

    if (location !== 'all') params.set('location', location)
    else params.delete('location')

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setPriceMin('')
    setPriceMax('')
    setSortBy('newest')
    setLocation('all')
    router.push(pathname)
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8 sticky top-24">
      <div>
        <h3 className="font-black text-2xl mb-2 text-gray-900">{t.filters.title}</h3>
        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
          {t.filters.sortBy}
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-700"
        >
          <option value="newest">{t.filters.newest}</option>
          <option value="oldest">{t.filters.oldest}</option>
          <option value="price-low">{t.filters.priceLow}</option>
          <option value="price-high">{t.filters.priceHigh}</option>
        </select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
          {t.filters.location}
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-700"
        >
          <option value="all">{t.filters.allLocations}</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
          {t.filters.priceRange}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold placeholder:text-gray-300"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {t.filters.apply}
        </Button>
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="w-full text-gray-400 font-bold hover:text-red-500 transition-colors"
        >
          {t.filters.clear}
        </Button>
      </div>
    </div>
  )
}
