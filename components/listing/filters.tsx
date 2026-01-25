'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, X, Tag, PackageCheck, TrendingUp, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

const LOCATIONS = [
  { value: '', label: 'allLocations' },
  { value: 'Bratislava', label: 'Bratislava' },
  { value: 'Košice', label: 'Košice' },
  { value: 'Prešov', label: 'Prešov' },
  { value: 'Žilina', label: 'Žilina' },
  { value: 'Banská Bystrica', label: 'Banská Bystrica' },
  { value: 'Nitra', label: 'Nitra' },
  { value: 'Trnava', label: 'Trnava' },
  { value: 'Martin', label: 'Martin' },
  { value: 'Poprad', label: 'Poprad' },
  { value: 'Trenčín', label: 'Trenčín' },
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

  const sortOptions = [
    { value: 'newest', label: t.filters.newest },
    { value: 'oldest', label: t.filters.oldest },
    { value: 'price-low', label: t.filters.priceLow },
    { value: 'price-high', label: t.filters.priceHigh },
    { value: 'views', label: t.filters.popular },
  ]

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="group/search relative">
        <div className="bg-primary/5 group-focus-within/search:bg-primary/10 absolute inset-0 rounded-2xl blur-sm transition-colors" />
        <div className="relative">
          <Search className="text-muted-foreground group-focus-within/search:text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder={t.home.searchPlaceholder}
            className="border-input bg-muted/30 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border py-4 pr-4 pl-12 text-base font-bold transition-all focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div className="space-y-3">
          <label className="text-primary flex items-center gap-2 text-xs font-black tracking-widest uppercase">
            <MapPin className="h-4 w-4" />
            {t.filters.location}
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="border-input bg-muted/30 h-12 w-full rounded-xl font-bold">
              <SelectValue placeholder={t.filters.allLocations} />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value || 'all'}>
                  {loc.value === '' ? t.filters.allLocations : loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-primary flex items-center gap-2 text-xs font-black tracking-widest uppercase">
            <Tag className="h-4 w-4" />
            {t.common.price} (EUR)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder={t.filters.priceMin}
              className="border-input bg-muted/30 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-base font-bold transition-all focus:ring-1 focus:outline-none"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder={t.filters.priceMax}
              className="border-input bg-muted/30 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-base font-bold transition-all focus:ring-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <label className="text-primary flex items-center gap-2 text-xs font-black tracking-widest uppercase">
            <PackageCheck className="h-4 w-4" />
            {t.filters.condition}
          </label>
          <div className="border-border/50 bg-muted/30 flex rounded-2xl border p-1.5">
            {[
              { value: '', label: t.common.all || 'All' },
              { value: 'new', label: t.filters.new },
              { value: 'used', label: t.filters.used },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setCondition(c.value)}
                className={cn(
                  'flex-1 rounded-xl py-2.5 text-xs font-black tracking-wider uppercase transition-all',
                  condition === c.value
                    ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <label className="text-primary flex items-center gap-2 text-xs font-black tracking-widest uppercase">
            <TrendingUp className="h-4 w-4" />
            {t.filters.sort}
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="border-input bg-muted/30 h-12 w-full rounded-xl font-bold">
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
      </div>

      {/* Action Buttons */}
      <div className="border-border/50 flex gap-3 border-t pt-6">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="shadow-primary/20 h-14 flex-1 rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg"
        >
          {isPending ? t.common.loading : t.filters.apply}
        </Button>
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={isPending}
          className="border-border/50 hover:bg-destructive/5 hover:text-destructive h-14 w-14 shrink-0 rounded-2xl transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
