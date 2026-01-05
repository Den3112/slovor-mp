'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useCallback, useState } from 'react'
import {
  ChevronDown,
  RotateCcw,
  MapPin,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react'

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

    if (sort !== 'newest') params.set('sort', sort)
    else params.delete('sort')

    if (priceMin) params.set('priceMin', priceMin)
    else params.delete('priceMin')

    if (priceMax) params.set('priceMax', priceMax)
    else params.delete('priceMax')

    if (location !== 'all') params.set('location', location)
    else params.delete('location')

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
    <div className="shadow-premium group relative mb-8 overflow-hidden rounded-[2rem] border border-border/40 bg-card p-6">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Sort */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <ArrowUpDown className="h-3 w-3" />
            {t.filters.sort}
          </label>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-input bg-muted/30 pl-4 pr-10 text-sm font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            >
              <option value="newest">
                {t.filters.newest}
              </option>
              <option value="oldest">
                {t.filters.oldest}
              </option>
              <option value="price-low">
                {t.filters.priceLow}
              </option>
              <option value="price-high">
                {t.filters.priceHigh}
              </option>
              <option value="views">
                {t.filters.popular}
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Price Range */}
        <div className="col-span-1 space-y-3 md:col-span-2 lg:col-span-1">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            {t.common.price || 'Price'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder={t.filters.priceMin}
              className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:font-medium focus:border-primary focus:ring-2 focus:ring-primary"
            />
            <div className="h-px w-4 bg-border" />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder={t.filters.priceMax}
              className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:font-medium focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3 lg:col-span-1">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {t.filters.location}
          </label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-input bg-muted/30 pl-4 pr-10 text-sm font-bold uppercase text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            >
              <option value="all">
                {t.filters.allLocations}
              </option>
              <option value="bratislava">Bratislava</option>
              <option value="košice">Košice</option>
              <option value="prešov">Prešov</option>
              <option value="žilina">Žilina</option>
              <option value="nitra">Nitra</option>
              <option value="banská bystrica">Banská Bystrica</option>
              <option value="trnava">Trnava</option>
              <option value="trenčín">Trenčín</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-3 lg:col-span-1">
          <Button
            onClick={applyFilters}
            className="h-12 flex-1 rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            {t.filters.apply}
          </Button>
          <Button
            onClick={resetFilters}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl border-border/50 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
