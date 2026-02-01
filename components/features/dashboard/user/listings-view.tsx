'use client'

import { useState, useMemo } from 'react'
import { Plus, Package, Eye, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { ListingRowActions } from '@/components/features/dashboard/user/components/listing-row-actions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface UserListingsViewProps {
    initialListings: any[] // Listing type
}

export function UserListingsView({ initialListings = [] }: UserListingsViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing'])
    const [activeTab, setActiveTab] = useState('all')
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter listings based on tab
    const filteredListings = useMemo(() => {
        let result = initialListings

        // Status Filter
        if (activeTab !== 'all') {
            if (activeTab === 'draft') {
                result = result.filter(l => l.status === 'draft' || l.status === 'pending')
            } else if (activeTab === 'archived') {
                result = result.filter(l => l.status === 'expired' || l.status === 'rejected')
            } else {
                result = result.filter(l => l.status === activeTab)
            }
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(l =>
                l.title.toLowerCase().includes(q) ||
                l.description?.toLowerCase().includes(q)
            )
        }

        // Sort
        return result.sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1)
        })
    }, [initialListings, activeTab, searchQuery, sortColumn, sortDirection])

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('desc') // Default to desc for new columns (usually Recency/Number)
        }
    }

    const columns: Column<any>[] = [
        {
            key: 'title',
            header: t('common:title'), // Adjust translation key
            sortable: true,
            className: "w-[40%]",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                        {row.images?.[0] ? (
                            <Image
                                src={row.images[0]}
                                alt={row.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Package className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-col">
                        <Link href={`/listings/${row.id}`} className="block truncate font-medium hover:text-primary transition-colors">
                            {row.title}
                        </Link>
                    </div>
                </div>
            )
        },
        {
            key: 'price',
            header: t('createListing:price'),
            sortable: true,
            cell: (row) => (
                <span className="font-medium">
                    {row.price} {row.currency}
                </span>
            )
        },
        {
            key: 'status',
            header: t('dashboard:status'), // Adjust
            sortable: true,
            cell: (row) => {
                let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
                if (row.is_active || row.status === 'active') variant = "default" // Actually "success" but using standard badge variants for now or custom class
                return (
                    <Badge variant={variant} className={cn(
                        row.is_active || row.status === 'active' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none" : "",
                        row.status === 'draft' ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20 shadow-none" : "",
                        row.status === 'sold' ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 shadow-none" : "",
                        (row.status === 'expired' || row.status === 'rejected') ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20 shadow-none" : ""
                    )}>
                        {row.status}
                    </Badge>
                )
            }
        },
        {
            key: 'stats', // Virtual column
            header: t('dashboard:views'),
            cell: (row) => (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1" title={t('dashboard:views')}>
                        <Eye className="h-3 w-3" /> {row.views_count || 0}
                    </span>
                    <span className="flex items-center gap-1" title={t('dashboard:favorites')}>
                        <Heart className="h-3 w-3" /> {row.favorites_count || 0}
                    </span>
                </div>
            )
        },
        {
            key: 'created_at',
            header: t('common:date'),
            sortable: true,
            cell: (row) => (
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'actions',
            header: '',
            cell: (row) => (
                <div className="flex justify-end">
                    <ListingRowActions listing={row} />
                </div>
            )
        }
    ]

    const tabs = [
        { value: 'all', label: t('dashboard:all'), count: initialListings.length },
        { value: 'active', label: t('dashboard:active'), count: initialListings.filter(l => l.status === 'active').length },
        { value: 'draft', label: t('dashboard:drafts'), count: initialListings.filter(l => l.status === 'draft' || l.status === 'pending').length },
        { value: 'sold', label: t('dashboard:sold'), count: initialListings.filter(l => l.status === 'sold').length },
        { value: 'archived', label: t('dashboard:archived'), count: initialListings.filter(l => l.status === 'expired' || l.status === 'rejected').length },
    ]

    return (
        <div className="space-y-6" data-testid="user-listings-view">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">{t('dashboard:myListings')}</h1>
                    <p className="mt-1 text-muted-foreground">{t('dashboard:inventoryDescription')}</p>
                </div>
                <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20">
                    <Link href="/post">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start border border-border/50">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                        >
                            {tab.label}
                            <span className="ml-2 rounded-full bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-bold">
                                {tab.count}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-6">
                    <DataGrid
                        columns={columns}
                        data={filteredListings}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onSearch={setSearchQuery}
                        searchPlaceholder={t('common:search')}
                        emptyMessage={t('dashboard:noListingsYet')}
                    />
                </div>
            </Tabs>
        </div>
    )
}
