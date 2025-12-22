'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'

export function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceMin) params.set('priceMin', priceMin)
    else params.delete('priceMin')

    if (priceMax) params.set('priceMax', priceMax)
    else params.delete('priceMax')

    if (sortBy !== 'newest') params.set('sort', sortBy)
    else params.delete('sort')

    router.push(`/listings?${params.toString()}`)
  }

  const clearFilters = () => {
    setPriceMin('')
    setPriceMax('')
    setSortBy('newest')
    router.push('/listings')
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">{t.filters.title}</h3>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.filters.sortBy}
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="newest">{t.filters.newest}</option>
          <option value="oldest">{t.filters.oldest}</option>
          <option value="price-low">{t.filters.priceLow}</option>
          <option value="price-high">{t.filters.priceHigh}</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.filters.priceRange}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="self-center text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {t.filters.apply}
        </button>
        <button
          onClick={clearFilters}
          className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          {t.filters.clear}
        </button>
      </div>
    </div>
  )
}
