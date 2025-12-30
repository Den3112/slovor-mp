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
  'Trenčín'
]

export function ListingFilters() {
  const router = useRouter()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
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
      <div className="relative group/search">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-sm group-focus-within/search:bg-primary/10 transition-colors" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within/search:text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder={t.home.searchPlaceholder}
            className="w-full pl-12 pr-4 py-4 bg-background border border-border/50 rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div className="space-y-3">
          <label className="text-xs font-black text-primary uppercase tracking-[0.15em] flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
          >
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc === 'All Locations' ? '' : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-xs font-black text-primary uppercase tracking-[0.15em] flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Price Range (EUR)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="Min"
              className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Max"
              className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <label className="text-xs font-black text-primary uppercase tracking-[0.15em] flex items-center gap-2">
            <PackageCheck className="w-4 h-4" />
            Condition
          </label>
          <div className="flex p-1.5 bg-muted/30 rounded-2xl border border-border/50">
            {['', 'new', 'used'].map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  condition === c
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <label className="text-xs font-black text-primary uppercase tracking-[0.15em] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
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
      <div className="flex gap-3 pt-6 border-t border-border/50">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          {isPending ? 'Applying...' : 'Apply'}
        </Button>
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={isPending}
          className="w-14 h-14 rounded-2xl border-border/50 hover:bg-destructive/5 hover:text-destructive transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
