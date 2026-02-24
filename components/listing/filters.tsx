'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'

interface ListingFiltersProps {
  categories: Category[]
}

import {
  CategorySelect,
  LocationSelect,
  PriceRange,
  ConditionToggle,
  SortSelect,
  DynamicAttributes,
} from './filters/index'

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
    { value: 'newest', label: t('filters:newest') },
    { value: 'price_asc', label: t('filters:priceAsc') },
    { value: 'price_desc', label: t('filters:priceDesc') },
    { value: 'views', label: t('filters:mostViewed') },
  ]

  const handleAttrChange = (attrId: string, value: any) => {
    setDynamicAttrs((prev) => ({
      ...prev,
      [attrId]: value,
    }))
  }

  return (
    <div className="bg-card space-y-10 rounded-2xl border border-border p-8 shadow-card">
      <div className="space-y-2">
        <h3 className="text-foreground text-xs font-black tracking-[0.2em] uppercase opacity-70">
          {t('filters:category')}
        </h3>
        <CategorySelect
          categories={categories}
          value={category}
          onChange={setCategory}
          locale={locale}
        />
      </div>

      <div className="bg-border/40 h-px w-full" />

      <div className="space-y-10">
        <div className="space-y-2">
          <h3 className="text-foreground text-xs font-black tracking-[0.2em] uppercase opacity-70">
            {t('filters:location')}
          </h3>
          <LocationSelect value={location} onChange={setLocation} />
        </div>

        <div className="space-y-2">
          <h3 className="text-foreground text-xs font-black tracking-[0.2em] uppercase opacity-70">
            {t('filters:priceRange')}
          </h3>
          <PriceRange
            min={priceMin}
            max={priceMax}
            onMinChange={setPriceMin}
            onMaxChange={setPriceMax}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-foreground text-xs font-black tracking-[0.2em] uppercase opacity-70">
            {t('filters:condition')}
          </h3>
          <ConditionToggle value={condition} onChange={setCondition} />
        </div>

        <div className="space-y-2">
          <h3 className="text-foreground text-xs font-black tracking-[0.2em] uppercase opacity-70">
            {t('filters:sortBy')}
          </h3>
          <SortSelect value={sort} onChange={setSort} options={sortOptions} />
        </div>

        <DynamicAttributes
          category={category}
          dynamicAttrs={dynamicAttrs}
          onAttrChange={handleAttrChange}
          locale={locale}
        />
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          size="lg"
          className="h-14 w-full rounded-xl text-[11px] font-black tracking-widest uppercase shadow-md transition-all hover:scale-105 active:scale-95"
        >
          {isPending ? t('common:loading') : t('filters:apply')}
        </Button>
        <Button
          variant="ghost"
          onClick={resetFilters}
          disabled={isPending}
          className="hover:bg-destructive/5 hover:text-destructive h-12 w-full rounded-xl text-[11px] font-black tracking-widest uppercase transition-colors"
        >
          {t('common:reset')}
        </Button>
      </div>
    </div>
  )
}
