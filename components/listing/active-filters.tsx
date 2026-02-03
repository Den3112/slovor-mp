'use client'

import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'

export function ActiveFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useTranslation(['filters', 'common'])

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
        else label = `${key}: ${value}`

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
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
                {t('filters:activeFilters') || 'Active'}:
            </span>

            {activeFilters.map((filter) => (
                <Badge
                    key={filter.key}
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 py-1.5 px-3 rounded-lg flex items-center gap-2 group cursor-default transition-all"
                >
                    <span className="text-[10px] font-black uppercase tracking-tight">
                        {filter.label}
                    </span>
                    <button
                        onClick={() => removeFilter(filter.key)}
                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${filter.key} filter`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}

            <button
                onClick={clearAll}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors ml-2"
            >
                {t('common:clearAll')}
            </button>
        </div>
    )
}
