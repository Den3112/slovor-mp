'use client'

// Listing Filters Component
// Principle #1: Small component
// Principle #7: Local state only

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, SlidersHorizontal, X, Tag, PackageCheck, TrendingUp, MapPin } from 'lucide-react'

const LOCATIONS = [
  'All Locations',
  'Bratislava',
  'Košice',
  'Prešov',
  'Žilina',
  'Banská Bystrica',
  'Nitra',
  'Trnava',
  'Martin',
  'Poprad',
  'Trenčín'
]

export function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [showFilters, setShowFilters] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) params.set('search', search)
    else params.delete('search')
    
    if (priceMin) params.set('priceMin', priceMin)
    else params.delete('priceMin')
    
    if (priceMax) params.set('priceMax', priceMax)
    else params.delete('priceMax')
    
    if (condition) params.set('condition', condition)
    else params.delete('condition')
    
    if (location) params.set('location', location)
    else params.delete('location')
    
    if (sort) params.set('sort', sort)
    else params.delete('sort')
    
    params.set('page', '1') // Reset to first page
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const resetFilters = () => {
    setSearch('')
    setPriceMin('')
    setPriceMax('')
    setCondition('')
    setLocation('')
    setSort('newest')
    startTransition(() => {
      router.push(window.location.pathname)
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Search listings..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {showFilters ? 'Hide' : 'Show'} Filters
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc === 'All Locations' ? '' : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Price Range (EUR)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="self-center text-gray-500">—</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <PackageCheck className="w-4 h-4" />
              Condition
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setCondition('')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  condition === ''
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCondition('new')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  condition === 'new'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setCondition('used')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  condition === 'used'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                Used
              </button>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Applying...' : 'Apply Filters'}
        </button>
        <button
          onClick={resetFilters}
          disabled={isPending}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
