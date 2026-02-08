'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/lib/i18n'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation(['common', 'filters', 'categories'])

  // Helper to update URL params
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Reset page on filter change
    params.delete('page')

    router.push(`/${locale}/search?${params.toString()}`)
  }

  // Price State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])

  useEffect(() => {
    const min = Number(searchParams.get('minPrice')) || 0
    const max = Number(searchParams.get('maxPrice')) || 5000
    setPriceRange([min, max])
  }, [searchParams])

  const handlePriceChange = (value: number[]) => {
    if (value.length >= 2) {
      setPriceRange([value[0] ?? 0, value[1] ?? 5000])
    }
  }

  const applyPriceFilter = () => {
    updateFilters({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    })
  }

  return (
    <div className="space-y-8 pb-32 md:pb-0">
      {/* Active Filters / Clear All */}
      {searchParams.toString().length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-bold uppercase">
            {t('filters:title')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/80 h-auto p-0"
            onClick={() => router.push(`/${locale}/search`)}
          >
            {t('filters:clearAll')}
          </Button>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-foreground font-bold">{t('common:price')}</h3>
        <Slider
          defaultValue={[0, 5000]}
          value={priceRange}
          max={10000}
          step={10}
          onValueChange={handlePriceChange}
          onValueCommit={applyPriceFilter}
          className="py-4"
        />
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="text-muted-foreground absolute top-2.5 left-3 text-xs font-medium">
              {t('common:currencySymbol', { defaultValue: '€' })}
            </span>
            <Input
              type="number"
              className="pl-7"
              placeholder={t('filters:priceMin')}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              onBlur={applyPriceFilter}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyPriceFilter()
                  e.currentTarget.blur()
                }
              }}
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="relative flex-1">
            <span className="text-muted-foreground absolute top-2.5 left-3 text-xs font-medium">
              {t('common:currencySymbol', { defaultValue: '€' })}
            </span>
            <Input
              type="number"
              className="pl-7"
              placeholder={t('filters:priceMax')}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              onBlur={applyPriceFilter}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyPriceFilter()
                  e.currentTarget.blur()
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-4">
        <h3 className="text-foreground font-bold">{t('filters:condition')}</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new"
              className="rounded-lg"
              checked={searchParams.get('condition') === 'new'}
              onCheckedChange={(checked) =>
                updateFilters({ condition: checked ? 'new' : null })
              }
            />
            <Label htmlFor="new">{t('filters:new')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="used"
              className="rounded-lg"
              checked={searchParams.get('condition') === 'used'}
              onCheckedChange={(checked) =>
                updateFilters({ condition: checked ? 'used' : null })
              }
            />
            <Label htmlFor="used">{t('filters:used')}</Label>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-foreground font-bold">{t('filters:location')}</h3>
        <Input
          placeholder={t('filters:cityPlaceholder')}
          defaultValue={searchParams.get('location') || ''}
          onBlur={(e) => updateFilters({ location: e.target.value || null })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilters({ location: e.currentTarget.value || null })
              e.currentTarget.blur()
            }
          }}
        />
      </div>

      {/* Dynamic Category Filters */}
      {(() => {
        const category = searchParams.get('category')
        if (!category) return null

        const categoryFilters: Record<
          string,
          Array<{
            key: string
            label: string
            type: 'select' | 'text' | 'range'
            options?: string[]
          }>
        > = {
          electronics: [
            {
              key: 'brand',
              label: 'Brand',
              type: 'select',
              options: ['Apple', 'Samsung', 'Sony', 'Dell', 'LG'],
            },
            {
              key: 'storage',
              label: 'Storage',
              type: 'select',
              options: ['128GB', '256GB', '512GB', '1TB'],
            },
          ],
          vehicles: [
            { key: 'year', label: 'Year', type: 'range' },
            { key: 'mileage', label: 'Max Mileage', type: 'text' },
          ],
          furniture: [
            {
              key: 'material',
              label: 'Material',
              type: 'select',
              options: ['Wood', 'Metal', 'Plastic', 'Glass'],
            },
          ],
        }

        const filters = categoryFilters[category]
        if (!filters) return null

        return (
          <div className="border-border/40 space-y-6 border-t pt-4">
            <h3 className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t(`categories:${category}`, {
                defaultValue: category.toUpperCase(),
              })}{' '}
              {t('filters:additional')}
            </h3>
            {filters.map((f) => (
              <div key={f.key} className="space-y-3">
                <Label className="text-xs font-bold tracking-widest uppercase opacity-60">
                  {f.label}
                </Label>
                {f.type === 'select' ? (
                  <Select
                    value={searchParams.get(`attr_${f.key}`) || 'all'}
                    onValueChange={(value) =>
                      updateFilters({
                        [`attr_${f.key}`]: value === 'all' ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="border-border/60 bg-background focus:ring-primary/10 h-10 w-full rounded-lg text-sm font-medium">
                      <SelectValue placeholder={t('common:all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common:all')}</SelectItem>
                      {f.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={`${f.label}...`}
                    defaultValue={searchParams.get(`attr_${f.key}`) || ''}
                    onBlur={(e) =>
                      updateFilters({
                        [`attr_${f.key}`]: e.target.value || null,
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )
      })()}

      {/* Sorting in Sidebar */}
      <div className="border-border/40 space-y-4 border-t pt-4">
        <h3 className="text-foreground font-bold">{t('common:sort')}</h3>
        <Select
          value={searchParams.get('sort') || 'newest'}
          onValueChange={(value) => updateFilters({ sort: value || null })}
        >
          <SelectTrigger className="border-border/60 bg-background focus:ring-primary/10 h-10 w-full rounded-lg text-sm font-medium">
            <SelectValue placeholder={t('filters:newest')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('filters:newest')}</SelectItem>
            <SelectItem value="oldest">{t('filters:oldest')}</SelectItem>
            <SelectItem value="price-low">{t('filters:priceLow')}</SelectItem>
            <SelectItem value="price-high">{t('filters:priceHigh')}</SelectItem>
            <SelectItem value="views">{t('filters:popular')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
