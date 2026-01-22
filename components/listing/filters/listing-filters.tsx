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
    <div className="space-y-10">
      {/* Search Input */}
      <div className="group/search relative">
        <div className="absolute inset-0 bg-primary/5 blur-md transition-colors group-focus-within/search:bg-primary/10" />
        <div className="relative">
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within/search:text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder={t.home.searchPlaceholder}
            className="w-full border-2 border-primary/10 bg-zinc-950/50 py-5 pl-14 pr-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-all placeholder:text-zinc-700 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Location */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <MapPin className="h-4 w-4" />
            {t.filters.location}
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-14 w-full rounded-none border-2 border-primary/10 bg-zinc-950/50 font-sans text-xs font-bold uppercase tracking-widest text-white">
              <SelectValue placeholder={t.filters.allLocations} />
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-primary/20 bg-zinc-950 font-sans">
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value || 'all'} className="rounded-none focus:bg-primary/10">
                  {loc.value === '' ? t.filters.allLocations : loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Tag className="h-4 w-4" />
            {t.common.price} (EUR)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder={t.filters.priceMin}
              className="w-full border-2 border-primary/10 bg-zinc-950/50 px-5 py-4 font-sans text-xs font-bold uppercase tracking-widest text-white transition-all placeholder:text-zinc-700 focus:border-primary focus:outline-none"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder={t.filters.priceMax}
              className="w-full border-2 border-primary/10 bg-zinc-950/50 px-5 py-4 font-sans text-xs font-bold uppercase tracking-widest text-white transition-all placeholder:text-zinc-700 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <PackageCheck className="h-4 w-4" />
            {t.filters.condition}
          </label>
          <div className="flex border-2 border-primary/10 bg-zinc-950/50 p-1.5">
            {[
              { value: '', label: t.common.all || 'All' },
              { value: 'new', label: t.filters.new },
              { value: 'used', label: t.filters.used },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setCondition(c.value)}
                className={cn(
                  'flex-1 py-3 font-sans text-[10px] font-bold uppercase tracking-widest transition-all',
                  condition === c.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-zinc-500 hover:text-white'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <TrendingUp className="h-4 w-4" />
            {t.filters.sort}
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-14 w-full rounded-none border-2 border-primary/10 bg-zinc-950/50 font-sans text-xs font-bold uppercase tracking-widest text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-primary/20 bg-zinc-950 font-sans">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-none focus:bg-primary/10">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 border-t-2 border-primary/10 pt-8">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="h-16 flex-1 rounded-none font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
        >
          {isPending ? t.common.loading : t.filters.apply}
        </Button>
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={isPending}
          className="h-16 w-16 shrink-0 rounded-none border-2 border-primary/10 text-zinc-500 transition-all hover:bg-destructive/10 hover:border-destructive hover:text-destructive active:scale-95"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
