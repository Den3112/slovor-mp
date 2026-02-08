'use client'

import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CATEGORY_ATTRIBUTES,
  getAttributeLabel,
} from '@/lib/constants/category-attributes'

export function ActiveFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, i18n } = useTranslation(['filters', 'common'])

  const activeFilters: Array<{ key: string; label: string; value: string }> = []

  // Collect all active filters from searchParams
  searchParams.forEach((value, key) => {
    if (key === 'page' || key === 'sort' || !value) return

    let label = ''
    if (key === 'search') label = `${t('common:search')}: ${value}`
    else if (key === 'priceMin') label = `Min: €${value}`
    else if (key === 'priceMax') label = `Max: €${value}`
    else if (key === 'condition') label = t(`filters:${value}`)
    else if (key === 'location') label = value
    else if (key === 'category') label = `${t('common:category')}: ${value}`
    else if (key.startsWith('attr_')) {
      const attrKey = key
        .replace('attr_', '')
        .replace('_min', '')
        .replace('_max', '')
      // Find attribute definition across all categories
      let attrDef: any = null
      for (const categoryAttrs of Object.values(CATEGORY_ATTRIBUTES)) {
        const found = categoryAttrs.find((a) => a.id === attrKey)
        if (found) {
          attrDef = found
          break
        }
      }

      if (attrDef) {
        const attrLabel = getAttributeLabel(attrDef, i18n.language)
        const suffix = key.endsWith('_min')
          ? ' (Min)'
          : key.endsWith('_max')
            ? ' (Max)'
            : ''
        label = `${attrLabel}${suffix}: ${value}`
      } else {
        label = `${attrKey}: ${value}`
      }
    } else label = `${key}: ${value}`

    activeFilters.push({ key, label, value })
  })

  if (activeFilters.length === 0) return null

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const clearAll = () => {
    router.push(window.location.pathname)
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground mr-1 text-[10px] font-bold tracking-widest uppercase">
        {t('filters:activeFilters') || 'Active'}:
      </span>

      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 transition-all"
        >
          <span className="text-[10px] font-bold tracking-tight uppercase">
            {filter.label}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFilter(filter.key)}
            className="hover:bg-primary/20 h-4 w-4 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${filter.key} filter`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        onClick={clearAll}
        className="text-muted-foreground hover:text-destructive ml-2 h-auto px-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-transparent"
      >
        {t('common:clearAll')}
      </Button>
    </div>
  )
}
