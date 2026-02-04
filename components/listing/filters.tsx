'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useRef } from 'react'
import { Tag, PackageCheck, TrendingUp, MapPin } from 'lucide-react'
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
import type { Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { CATEGORY_ATTRIBUTES, getAttributeLabel } from '@/lib/constants/category-attributes'

const LOCATIONS = [
  { value: '', label: 'allLocations' },
  { value: 'Bratislava', label: 'Bratislava' },
  { value: 'Košice', label: 'Košice' },
  { value: 'Prešov', label: 'Prešov' },
  { value: 'Žilina', label: 'Žilina' },
  { value: 'Banská Bystrica', label: 'Banská Bystrica' },
  { value: 'Nitra', label: 'Nitra' },
  { value: 'Trnava', label: 'Trnava' },
  { value: 'Trenčín', label: 'Trenčín' },
]

interface ListingFiltersProps {
  categories: Category[]
}

export function ListingFilters({ categories }: ListingFiltersProps) {
  const router = useRouter()
  const { t, i18n } = useTranslation(['filters', 'common'])
  const locale = i18n.language
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  const [condition, setCondition] = useState(
    searchParams.get('condition') || ''
  )
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  // Dynamic attributes state
  const [dynamicAttrs, setDynamicAttrs] = useState<Record<string, any>>(() => {
    const attrs: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('attr_')) {
        const attrKey = key.replace('attr_', '')
        if (attrKey.endsWith('_min')) {
          const coreKey = attrKey.replace('_min', '')
          attrs[coreKey] = { ...attrs[coreKey], min: value }
        } else if (attrKey.endsWith('_max')) {
          const coreKey = attrKey.replace('_max', '')
          attrs[coreKey] = { ...attrs[coreKey], max: value }
        } else {
          attrs[attrKey] = value
        }
      }
    })
    return attrs
  })

  const currentCategoryAttributes = category ? CATEGORY_ATTRIBUTES[category] : []
  const initialCategoryRef = useRef(searchParams.get('category') || '')

  // Reset dynamic attributes when category changes (if it wasn't the initial category)
  useEffect(() => {
    if (category !== initialCategoryRef.current) {
      setDynamicAttrs({})
      initialCategoryRef.current = category
    }
  }, [category])

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (priceMin) params.set('priceMin', priceMin)
      if (priceMax) params.set('priceMax', priceMax)
      if (condition) params.set('condition', condition)
      if (location && location !== 'all') params.set('location', location)
      if (category && category !== 'all') params.set('category', category)
      if (sort) params.set('sort', sort)

      // Add dynamic attributes
      Object.entries(dynamicAttrs).forEach(([key, value]) => {
        if (typeof value === 'object') {
          if (value.min) params.set(`attr_${key}_min`, value.min)
          if (value.max) params.set(`attr_${key}_max`, value.max)
        } else if (value) {
          params.set(`attr_${key}`, value)
        }
      })

      router.push(`?${params.toString()}`)
    })
  }

  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setPriceMin('')
    setPriceMax('')
    setCondition('')
    setLocation('')
    setSort('newest')
    setDynamicAttrs({})
    router.push(window.location.pathname)
  }

  const sortOptions = [
    { value: 'newest', label: t('filters.newest') },
    { value: 'price_asc', label: t('filters.priceAsc') },
    { value: 'price_desc', label: t('filters.priceDesc') },
    { value: 'views', label: t('filters.mostViewed') },
  ]

  return (
    <div className="space-y-8">
      {/* Category Selection */}
      <div className="space-y-3">
        <label className="text-primary flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
          <Tag className="h-4 w-4" />
          {t('common:category')}
        </label>
        <Select value={category || 'all'} onValueChange={(v) => setCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
            <SelectValue placeholder={t('filters:allCategories') || 'All Categories'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters:allCategories') || 'All Categories'}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {getLocalizedCategoryName(cat, locale, t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-border/40 h-px w-full" />

      {/* Advanced Filters Section */}
      <div className="space-y-6">
        {/* Location */}
        <div className="space-y-3">
          <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
            <MapPin className="h-3.5 w-3.5" />
            {t('filters:location')}
          </label>
          <Select value={location || 'all'} onValueChange={(v) => setLocation(v === 'all' ? '' : v)}>
            <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
              <SelectValue placeholder={t('filters.allLocations')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allLocations')}</SelectItem>
              {LOCATIONS.filter(l => l.value).map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
            <Tag className="h-3.5 w-3.5" />
            {t('common:price')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="text-muted-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black">€</span>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder={t('filters.priceMin')}
                className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 pr-3 pl-7 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
              />
            </div>
            <div className="relative">
              <span className="text-muted-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black">€</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder={t('filters.priceMax')}
                className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 pr-3 pl-7 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
            <PackageCheck className="h-3.5 w-3.5" />
            {t('filters:condition')}
          </label>
          <div className="bg-muted/20 flex rounded-xl border border-border/60 p-1">
            {[
              { value: '', label: t('common.all') || 'All' },
              { value: 'new', label: t('filters.new') },
              { value: 'used', label: t('filters.used') },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setCondition(c.value)}
                className={cn(
                  'flex-1 rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all',
                  condition === c.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
            <TrendingUp className="h-3.5 w-3.5" />
            {t('filters:sort')}
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
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

        {/* Dynamic Attributes */}
        {currentCategoryAttributes && currentCategoryAttributes.length > 0 && (
          <>
            <div className="bg-border/40 my-2 h-px w-full" />
            <div className="space-y-6">
              {currentCategoryAttributes.map((attr) => (
                <div key={attr.id} className="space-y-3">
                  <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    {getAttributeLabel(attr, locale)}
                    {attr.unit && <span className="lowercase opacity-60">({attr.unit})</span>}
                  </label>

                  {attr.type === 'select' && (
                    <Select
                      value={dynamicAttrs[attr.id] || 'all'}
                      onValueChange={(v) =>
                        setDynamicAttrs((prev) => ({
                          ...prev,
                          [attr.id]: v === 'all' ? '' : v,
                        }))
                      }
                    >
                      <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
                        <SelectValue placeholder={t('common.all')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.all')}</SelectItem>
                        {attr.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label[locale] || opt.label['en']}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {attr.type === 'range' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={dynamicAttrs[attr.id]?.min || ''}
                        onChange={(e) =>
                          setDynamicAttrs((prev) => ({
                            ...prev,
                            [attr.id]: { ...prev[attr.id], min: e.target.value },
                          }))
                        }
                        placeholder={t('filters.min') || 'Min'}
                        className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 px-3 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={dynamicAttrs[attr.id]?.max || ''}
                        onChange={(e) =>
                          setDynamicAttrs((prev) => ({
                            ...prev,
                            [attr.id]: { ...prev[attr.id], max: e.target.value },
                          }))
                        }
                        placeholder={t('filters.max') || 'Max'}
                        className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 px-3 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
                      />
                    </div>
                  )}

                  {attr.type === 'text' && (
                    <input
                      type="text"
                      value={dynamicAttrs[attr.id] || ''}
                      onChange={(e) =>
                        setDynamicAttrs((prev) => ({
                          ...prev,
                          [attr.id]: e.target.value,
                        }))
                      }
                      className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 h-11 w-full rounded-xl border px-4 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-4">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="h-11 w-full rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/20"
        >
          {isPending ? t('common.loading') : t('filters.apply')}
        </Button>
        <Button
          variant="ghost"
          onClick={resetFilters}
          disabled={isPending}
          className="hover:bg-destructive/5 hover:text-destructive h-10 w-full rounded-xl text-[10px] font-black tracking-widest uppercase transition-colors"
        >
          {t('common:reset')}
        </Button>
      </div>
    </div>
  )
}
