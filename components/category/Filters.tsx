'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCallback, useState } from 'react'
import {
  RotateCcw,
  MapPin,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react'

/**
 * Filters Component - Uses Radix Select for proper dark mode support
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

  const sortOptions = [
    { value: 'newest', label: t.filters.newest },
    { value: 'oldest', label: t.filters.oldest },
    { value: 'price-low', label: t.filters.priceLow },
    { value: 'price-high', label: t.filters.priceHigh },
    { value: 'views', label: t.filters.popular },
  ]

  const locationOptions = [
    { value: 'all', label: t.filters.allLocations },
    { value: 'bratislava', label: 'Bratislava' },
    { value: 'košice', label: 'Košice' },
    { value: 'prešov', label: 'Prešov' },
    { value: 'žilina', label: 'Žilina' },
    { value: 'nitra', label: 'Nitra' },
    { value: 'banská bystrica', label: 'Banská Bystrica' },
    { value: 'trnava', label: 'Trnava' },
    { value: 'trenčín', label: 'Trenčín' },
  ]

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
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-12 w-full rounded-xl border-input bg-muted/30 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:font-medium focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
            <div className="h-px w-4 bg-border" />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder={t.filters.priceMax}
              className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:font-medium focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3 lg:col-span-1">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {t.filters.location}
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12 w-full rounded-xl border-input bg-muted/30 font-bold uppercase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
