'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Drawer } from 'vaul'
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface MobileFilterDrawerProps {
    resultCount?: number
}

export function MobileFilterDrawer({ resultCount }: MobileFilterDrawerProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    // Price State
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
    const [condition, setCondition] = useState<string | null>(null)
    const [location, setLocation] = useState('')

    // Sync with URL params
    useEffect(() => {
        const min = Number(searchParams.get('minPrice')) || 0
        const max = Number(searchParams.get('maxPrice')) || 5000
        setPriceRange([min, max])
        setCondition(searchParams.get('condition'))
        setLocation(searchParams.get('location') || '')
    }, [searchParams])

    const hasActiveFilters =
        searchParams.get('minPrice') ||
        searchParams.get('maxPrice') ||
        searchParams.get('condition') ||
        searchParams.get('location')

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        // Price
        if (priceRange[0] > 0) {
            params.set('minPrice', priceRange[0].toString())
        } else {
            params.delete('minPrice')
        }

        if (priceRange[1] < 5000) {
            params.set('maxPrice', priceRange[1].toString())
        } else {
            params.delete('maxPrice')
        }

        // Condition
        if (condition) {
            params.set('condition', condition)
        } else {
            params.delete('condition')
        }

        // Location
        if (location.trim()) {
            params.set('location', location.trim())
        } else {
            params.delete('location')
        }

        // Reset page
        params.delete('page')

        router.push(`/search?${params.toString()}`)
        setOpen(false)
    }

    const clearFilters = () => {
        setPriceRange([0, 5000])
        setCondition(null)
        setLocation('')
        router.push('/search')
        setOpen(false)
    }

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button
                    className={cn(
                        "flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all active:scale-95",
                        hasActiveFilters
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 bg-muted/30 text-foreground"
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    {t.filters.title}
                    {hasActiveFilters && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
                            !
                        </span>
                    )}
                </button>
            </Drawer.Trigger>

            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
                <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[2rem] border-t border-border bg-background">
                    {/* Handle */}
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                        <div>
                            <Drawer.Title className="text-xl font-black text-foreground">{t.filters.title}</Drawer.Title>
                            {resultCount !== undefined && (
                                <p className="text-sm text-muted-foreground">
                                    {resultCount} {t.common.listings}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex h-10 items-center gap-2 rounded-xl border border-border/50 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-destructive"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    {t.filters.clearAll}
                                </button>
                            )}
                            <Drawer.Close asChild>
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40">
                                    <X className="h-5 w-5" />
                                </button>
                            </Drawer.Close>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-8">
                            {/* Price Range */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                                    {t.common.price}
                                </h3>
                                <Slider
                                    value={priceRange}
                                    max={10000}
                                    step={50}
                                    onValueChange={(value) => {
                                        if (value.length >= 2) {
                                            setPriceRange([value[0] ?? 0, value[1] ?? 5000])
                                        }
                                    }}
                                    className="py-4"
                                />
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        <Input
                                            type="number"
                                            className="h-12 pl-9 text-base"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                        />
                                    </div>
                                    <span className="text-muted-foreground">—</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        <Input
                                            type="number"
                                            className="h-12 pl-9 text-base"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Condition */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                                    {t.filters.condition}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setCondition(condition === 'new' ? null : 'new')}
                                        className={cn(
                                            "flex h-14 items-center justify-center rounded-xl border text-base font-bold transition-all",
                                            condition === 'new'
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border/50 text-muted-foreground"
                                        )}
                                    >
                                        {t.filters.new}
                                    </button>
                                    <button
                                        onClick={() => setCondition(condition === 'used' ? null : 'used')}
                                        className={cn(
                                            "flex h-14 items-center justify-center rounded-xl border text-base font-bold transition-all",
                                            condition === 'used'
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border/50 text-muted-foreground"
                                        )}
                                    >
                                        {t.filters.used}
                                    </button>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                                    {t.filters.location}
                                </h3>
                                <Input
                                    placeholder={t.filters.cityPlaceholder}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="h-14 text-base"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border/50 p-6 safe-bottom">
                        <Button
                            onClick={applyFilters}
                            className="h-14 w-full rounded-2xl text-base font-black"
                        >
                            {t.filters.apply}
                            {resultCount !== undefined && ` (${resultCount})`}
                        </Button>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
