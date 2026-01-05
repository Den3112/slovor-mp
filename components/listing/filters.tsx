'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, X, Tag, PackageCheck, TrendingUp, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

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
  'Trenčín',
]

export function ListingFilters() {
  const router = useRouter()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  const [condition, setCondition] = useState(
    searchParams.get('condition') || ''
  )
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

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

    params.set('page', '1')

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
    <div className="space-y-8">
      {/* Search Input */}
      <div className="group/search relative">
        <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-sm transition-colors group-focus-within/search:bg-primary/10" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder={t.home.searchPlaceholder}
            className="w-full rounded-xl border border-input bg-muted/30 py-4 pl-12 pr-4 text-sm font-bold transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-primary">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm font-bold transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc === 'All Locations' ? '' : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-primary">
            <Tag className="h-4 w-4" />
            Price Range (EUR)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="Min"
              className="w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm font-bold transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Max"
              className="w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm font-bold transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-primary">
            <PackageCheck className="h-4 w-4" />
            Condition
          </label>
          <div className="flex rounded-2xl border border-border/50 bg-muted/30 p-1.5">
            {['', 'new', 'used'].map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={cn(
                  'flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all',
                  condition === c
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {c || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-primary">
            <TrendingUp className="h-4 w-4" />
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm font-bold transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 border-t border-border/50 pt-6">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="h-14 flex-1 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          {isPending ? 'Applying...' : 'Apply'}
        </Button>
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={isPending}
          className="h-14 w-14 shrink-0 rounded-2xl border-border/50 transition-colors hover:bg-destructive/5 hover:text-destructive"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
