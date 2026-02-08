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
import { Input } from '@/components/ui/input'
import { useCallback, useState } from 'react'
import { RotateCcw, MapPin, DollarSign, ArrowUpDown } from 'lucide-react'

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
    { value: 'newest', label: t('filters:newest') },
    { value: 'oldest', label: t('filters:oldest') },
    { value: 'price-low', label: t('filters:priceLow') },
    { value: 'price-high', label: t('filters:priceHigh') },
    { value: 'views', label: t('filters:popular') },
  ]

  const locationOptions = [
    { value: 'all', label: t('filters:allLocations') },
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
    <div className="border-border/60 bg-card relative mb-8 overflow-hidden rounded-lg border p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Sort */}
        <div className="space-y-3">
          <label className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <ArrowUpDown className="h-3 w-3" />
            {t('filters:sort')}
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="border-input bg-muted/30 h-12 w-full rounded-lg font-bold">
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
          <label className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <DollarSign className="h-3 w-3" />
            {t('common:price') || 'Price'}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder={t('filters:priceMin')}
              className="h-12 w-full rounded-lg px-4 text-sm font-bold"
            />
            <div className="bg-border h-px w-4" />
            <Input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder={t('filters:priceMax')}
              className="h-12 w-full rounded-lg px-4 text-sm font-bold"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3 lg:col-span-1">
          <label className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <MapPin className="h-3 w-3" />
            {t('filters:location')}
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="border-input bg-muted/30 h-12 w-full rounded-lg font-bold uppercase">
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
            className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 h-12 flex-1 rounded-lg font-bold shadow-lg"
          >
            {t('filters:apply')}
          </Button>
          <Button
            onClick={resetFilters}
            variant="outline"
            size="icon"
            className="border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground h-12 w-12 rounded-lg bg-transparent"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
