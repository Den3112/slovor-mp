'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useRef } from 'react'
import {
  LayoutGrid,
  MapPin,
  Euro,
  PackageCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useTranslation } from '@/shared/lib/i18n'
import type { Category } from '@/shared/lib/types/database'

import { CategorySelect } from './category-select'
import { LocationSelect } from './location-select'
import { PriceRange } from './price-range'
import { ConditionToggle } from './condition-toggle'
import { SortSelect } from './sort-select'
import { DynamicAttributes } from './dynamic-attributes'

interface ListingFiltersProps {
  categories: Category[]
}

const FilterSectionHeader = ({
  icon: Icon,
  label,
}: {
  icon: any
  label: string
}) => (
  <div className="flex items-center gap-2 opacity-60">
    <Icon className="h-4 w-4" />
    <span className="text-xs font-bold tracking-widest uppercase">{label}</span>
  </div>
)

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

  useEffect(() => {
    if (category !== initialCategoryRef.current) {
      // Guard with setTimeout to avoid synchronous state update during render/effect phase
      const timer = setTimeout(() => {
        setDynamicAttrs({})
        initialCategoryRef.current = category
      }, 0)
      return () => clearTimeout(timer)
    }
    return () => {}
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
    <div className="bg-card border-border shadow-card space-y-10 rounded-2xl border p-8">
      <div className="space-y-4">
        <FilterSectionHeader icon={LayoutGrid} label={t('common:category')} />
        <CategorySelect
          categories={categories}
          value={category}
          onChange={setCategory}
          locale={locale}
        />
      </div>

      <div className="bg-border/40 h-px w-full" />

      <div className="space-y-10">
        <div className="space-y-4">
          <FilterSectionHeader icon={MapPin} label={t('filters:location')} />
          <LocationSelect value={location} onChange={setLocation} />
        </div>

        <div className="space-y-4">
          <FilterSectionHeader icon={Euro} label={t('common:price')} />
          <PriceRange
            min={priceMin}
            max={priceMax}
            onMinChange={setPriceMin}
            onMaxChange={setPriceMax}
          />
        </div>

        <div className="space-y-4">
          <FilterSectionHeader
            icon={PackageCheck}
            label={t('filters:condition')}
          />
          <ConditionToggle value={condition} onChange={setCondition} />
        </div>

        <div className="space-y-4">
          <FilterSectionHeader
            icon={SlidersHorizontal}
            label={t('filters:sortBy')}
          />
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
