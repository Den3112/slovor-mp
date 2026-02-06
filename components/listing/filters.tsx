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
  DynamicAttributes
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
    <div className="space-y-8">
      <CategorySelect
        categories={categories}
        value={category}
        onChange={setCategory}
        locale={locale}
      />

      <div className="bg-border/40 h-px w-full" />

      <div className="space-y-6">
        <LocationSelect
          value={location}
          onChange={setLocation}
        />

        <PriceRange
          min={priceMin}
          max={priceMax}
          onMinChange={setPriceMin}
          onMaxChange={setPriceMax}
        />

        <ConditionToggle
          value={condition}
          onChange={setCondition}
        />

        <SortSelect
          value={sort}
          onChange={setSort}
          options={sortOptions}
        />

        <DynamicAttributes
          category={category}
          dynamicAttrs={dynamicAttrs}
          onAttrChange={handleAttrChange}
          locale={locale}
        />
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="h-11 w-full rounded-xl text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-primary/20"
        >
          {isPending ? t('common:loading') : t('filters:apply')}
        </Button>
        <Button
          variant="ghost"
          onClick={resetFilters}
          disabled={isPending}
          className="hover:bg-destructive/5 hover:text-destructive h-10 w-full rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          {t('common:reset')}
        </Button>
      </div>
    </div>
  )
}
