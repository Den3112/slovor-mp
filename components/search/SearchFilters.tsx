'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function SearchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useTranslation()

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

        router.push(`/search?${params.toString()}`)
    }

    // Price State
    const [priceRange, setPriceRange] = useState([0, 5000])

    useEffect(() => {
        const min = Number(searchParams.get('minPrice')) || 0
        const max = Number(searchParams.get('maxPrice')) || 5000
        setPriceRange([min, max])
    }, [searchParams])

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value)
    }

    const applyPriceFilter = () => {
        updateFilters({
            minPrice: priceRange[0].toString(),
            maxPrice: priceRange[1].toString()
        })
    }

    return (
        <div className="space-y-8">
            {/* Active Filters / Clear All */}
            {(searchParams.toString().length > 0) && (
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase text-gray-500">Filters</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 h-auto p-0"
                        onClick={() => router.push('/search')}
                    >
                        Clear all
                    </Button>
                </div>
            )}

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">{t.filters?.price || 'Price'}</h3>
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
                        <span className="absolute left-3 top-2.5 text-gray-400">€</span>
                        <Input
                            type="number"
                            className="pl-7"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            onBlur={applyPriceFilter}
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-400">€</span>
                        <Input
                            type="number"
                            className="pl-7"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            onBlur={applyPriceFilter}
                        />
                    </div>
                </div>
            </div>

            {/* Condition */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">{t.filters?.condition || 'Condition'}</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="new"
                            checked={searchParams.get('condition') === 'new'}
                            onCheckedChange={(checked) => updateFilters({ condition: checked ? 'new' : null })}
                        />
                        <Label htmlFor="new">{t.condition?.new || 'New'}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="used"
                            checked={searchParams.get('condition') === 'used'}
                            onCheckedChange={(checked) => updateFilters({ condition: checked ? 'used' : null })}

                        />
                        <Label htmlFor="used">{t.condition?.used || 'Used'}</Label>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">{t.filters?.location || 'Location'}</h3>
                <Input
                    placeholder="City or Region"
                    defaultValue={searchParams.get('location') || ''}
                    onBlur={(e) => updateFilters({ location: e.target.value || null })}
                />
            </div>
        </div>
    )
}
