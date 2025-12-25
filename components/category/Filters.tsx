'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useCallback, useState } from 'react'

/**
 * Filters Component
 * 
 * WHY IT EXISTS:
 * - Allows users to filter listings by price, sort order, location
 * - Uses URL params for state (shareable links, back button works)
 * - Client component for interactivity
 * 
 * HOW IT WORKS:
 * 1. Reads current filters from URL searchParams
 * 2. Updates state in local form
 * 3. On apply, pushes new URL with updated params
 * 4. Server Component re-fetches with new filters
 */

export function Filters() {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current values from URL
  const currentSort = searchParams.get('sort') || 'newest'
  const currentPriceMin = searchParams.get('priceMin') || ''
  const currentPriceMax = searchParams.get('priceMax') || ''
  const currentLocation = searchParams.get('location') || 'all'

  // Local state for form inputs
  const [sort, setSort] = useState(currentSort)
  const [priceMin, setPriceMin] = useState(currentPriceMin)
  const [priceMax, setPriceMax] = useState(currentPriceMax)
  const [location, setLocation] = useState(currentLocation)

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update params
    if (sort !== 'newest') {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }

    if (priceMin) {
      params.set('priceMin', priceMin)
    } else {
      params.delete('priceMin')
    }

    if (priceMax) {
      params.set('priceMax', priceMax)
    } else {
      params.delete('priceMax')
    }

    if (location !== 'all') {
      params.set('location', location)
    } else {
      params.delete('location')
    }

    // Reset to page 1 when filters change
    params.delete('page')

    // Push new URL
    router.push(`${pathname}?${params.toString()}`)
  }, [sort, priceMin, priceMax, location, searchParams, pathname, router])

  const resetFilters = useCallback(() => {
    setSort('newest')
    setPriceMin('')
    setPriceMax('')
    setLocation('all')
    router.push(pathname)
  }, [pathname, router])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{t.filters.title || 'Filters'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.filters.sort || 'Sort by'}
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">{t.filters.newest || 'Newest first'}</option>
            <option value="oldest">{t.filters.oldest || 'Oldest first'}</option>
            <option value="price-low">{t.filters.priceLow || 'Price: Low to High'}</option>
            <option value="price-high">{t.filters.priceHigh || 'Price: High to Low'}</option>
            <option value="views">{t.filters.popular || 'Most Popular'}</option>
          </select>
        </div>

        {/* Price Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.filters.priceMin || 'Min Price'}
          </label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Price Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.filters.priceMax || 'Max Price'}
          </label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="∞"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.filters.location || 'Location'}
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t.filters.allLocations || 'All locations'}</option>
            <option value="bratislava">Bratislava</option>
            <option value="košice">Košice</option>
            <option value="prešov">Prešov</option>
            <option value="žilina">Žilina</option>
            <option value="nitra">Nitra</option>
            <option value="banská bystrica">Banská Bystrica</option>
            <option value="trnava">Trnava</option>
            <option value="trenčín">Trenčín</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          onClick={applyFilters}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {t.filters.apply || 'Apply Filters'}
        </Button>
        <Button
          onClick={resetFilters}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50 font-semibold"
        >
          {t.filters.reset || 'Reset'}
        </Button>
      </div>
    </div>
  )
}
