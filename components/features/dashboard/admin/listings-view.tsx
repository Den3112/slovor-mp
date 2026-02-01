'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Layers, CheckCircle2, XCircle,
    ShieldAlert, Tag
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { listingsApi, adminApi, type Listing } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AdminListingsViewProps {
    initialListings?: Listing[]
}

export function AdminListingsView({ initialListings = [] }: AdminListingsViewProps) {
    const { t } = useTranslation('common')
    const [listings, setListings] = useState<Listing[]>(initialListings)
    const [isLoading, setIsLoading] = useState(initialListings.length === 0)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all') // all, pending, active, rejected
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Sorting state
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Load listings if not provided (though page usually passes them)
    useEffect(() => {
        if (initialListings.length === 0) {
            loadListings()
        }
    }, [initialListings.length])

    const loadListings = async () => {
        setIsLoading(true)
        const { data } = await listingsApi.getAdminAll()
        if (data) setListings(data)
        setIsLoading(false)
    }

    const handleAction = async (id: string, status: 'active' | 'rejected' | 'draft') => {
        const { error } = await listingsApi.update(id, { status })
        if (error) {
            toast.error(error)
        } else {
            toast.success(status === 'active' ? t('admin.listingApproved') : t('admin.listingRejected'))
            setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
            adminApi.logAction({
                target_id: id,
                target_type: 'listing',
                action_type: status === 'active' ? 'approve' : 'reject',
                reason: status === 'active' ? 'Admin approved listing' : `Admin set status to ${status}`
            })
        }
    }

    const handleBulkAction = async (status: 'active' | 'rejected') => {
        toast.promise(
            Promise.all(selectedIds.map(id => listingsApi.update(id, { status }))),
            {
                loading: 'Processing bulk action...',
                success: () => {
                    setListings(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, status } : l))
                    setSelectedIds([])
                    return 'Bulk action completed successfully'
                },
                error: 'Failed to process some items'
            }
        )
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredListings.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredListings.map(l => l.id))
        }
    }

    // Filtering & Sorting
    const filteredListings = useMemo(() => {
        let result = listings

        // Tab Filter
        if (activeTab !== 'all') {
            if (activeTab === 'pending') result = result.filter(l => l.status === 'draft' || l.status === 'pending')
            else result = result.filter(l => l.status === activeTab)
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(l =>
                l.title.toLowerCase().includes(q) ||
                (l.user?.display_name?.toLowerCase() || '').includes(q)
            )
        }

        // Sort
        return result.sort((a, b) => {
            const aValue = a[sortColumn as keyof Listing]
            const bValue = b[sortColumn as keyof Listing]

            // Handle sorting logic safely
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            // Basic fallback for numbers or mixed types
            if (aValue === bValue) return 0
            if (aValue === null || aValue === undefined) return 1
            if (bValue === null || bValue === undefined) return -1

            return sortDirection === 'asc'
                ? (aValue > bValue ? 1 : -1)
                : (aValue < bValue ? 1 : -1)
        })
    }, [listings, activeTab, searchQuery, sortColumn, sortDirection])

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('desc')
        }
    }

    // Column Definitions
    const columns: Column<Listing>[] = [
        {
            key: 'select',
            header: (
                <Checkbox
                    checked={filteredListings.length > 0 && selectedIds.length === filteredListings.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                />
            ),
            cell: (row) => (
                <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                    aria-label={`Select ${row.title}`}
                />
            ),
            className: "w-[50px]"
        },
        {
            key: 'title',
            header: t('admin.tableListing'),
            sortable: true,
            className: "min-w-[300px]",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                        {row.images?.[0] ? (
                            <Image src={row.images[0]} alt={row.title} fill className="object-cover" unoptimized />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Tag className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <Link href={`/listings/${row.id}`} target="_blank" className="font-medium hover:text-primary transition-colors line-clamp-1 group-hover:underline">
                            {row.title}
                        </Link>
                        <span className="text-xs text-muted-foreground font-bold">{row.price} {row.currency}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'user',
            header: t('admin.tableSeller'),
            sortable: false,
            cell: (row) => (
                <div className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="h-3 w-3" />
                    </div>
                    <span className="truncate max-w-[150px]">{row.user?.display_name || t('admin.unknown')}</span>
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin.tableStatus'),
            sortable: true,
            cell: (row) => {
                const statusObj = {
                    active: { color: "bg-emerald-500/10 text-emerald-600", label: t('admin.active') },
                    draft: { color: "bg-amber-500/10 text-amber-600", label: 'Pending' },
                    pending: { color: "bg-amber-500/10 text-amber-600", label: 'Pending' },
                    rejected: { color: "bg-destructive/10 text-destructive", label: t('admin.rejected') },
                    expired: { color: "bg-muted text-muted-foreground", label: 'Expired' },
                    sold: { color: "bg-blue-500/10 text-blue-600", label: 'Sold' },
                }
                // @ts-ignore
                const current = statusObj[row.status] || statusObj.draft

                return (
                    <Badge variant="outline" className={cn("border-0 font-bold", current.color)}>
                        {current.label}
                    </Badge>
                )
            }
        },
        {
            key: 'created_at',
            header: t('admin.tableDate'),
            sortable: true,
            cell: (row) => (
                <div className="flex flex-col text-xs">
                    <span className="font-medium text-foreground">{new Date(row.created_at).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">{new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: 'actions',
            header: <span className="sr-only">{t('admin.tableActions')}</span>,
            className: "text-right",
            cell: (row) => (
                <div className="flex justify-end gap-1">
                    {row.status === 'active' || row.status === 'sold' ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAction(row.id, 'draft')}
                            title="Suspend to Draft"
                            className="text-amber-500 hover:bg-amber-500/10 hover:text-amber-600 h-8 w-8"
                        >
                            <ShieldAlert className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAction(row.id, 'active')}
                            title="Approve"
                            className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 h-8 w-8"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(row.id, 'rejected')}
                        title="Reject"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    const tabs = [
        { value: 'all', label: 'All Listings', count: listings.length },
        { value: 'pending', label: 'Pending Review', count: listings.filter(l => l.status === 'draft' || l.status === 'pending').length },
        { value: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length },
        { value: 'rejected', label: 'Rejected', count: listings.filter(l => l.status === 'rejected').length },
    ]

    return (
        <div className="space-y-6" data-testid="admin-listings-view">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <Layers className="h-8 w-8 text-primary" />
                        {t('admin.moderation')}
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">{t('admin.reviewManageListings')}</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6">
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start border border-border/50">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                            >
                                {tab.label}
                                <span className={cn(
                                    "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                                    tab.value === 'pending' && tab.count > 0 ? "bg-orange-500 text-white" : "bg-muted-foreground/10"
                                )}>
                                    {tab.count}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Data Grid */}
                <DataGrid
                    columns={columns}
                    data={filteredListings}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onSearch={setSearchQuery}
                    searchPlaceholder={t('admin.searchPlaceholderListings')}
                    isLoading={isLoading}
                    emptyMessage="No listings found matching criteria."
                />
            </Tabs>

            {/* Floating Bulk Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 border border-white/10"
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                {selectedIds.length}
                            </span>
                            <span className="text-sm font-bold">Selected</span>
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleBulkAction('active')} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-8 text-xs font-bold">
                                Approve All
                            </Button>
                            <Button size="sm" onClick={() => handleBulkAction('rejected')} variant="destructive" className="rounded-xl h-8 text-xs font-bold">
                                Reject All
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="text-white/60 hover:text-white rounded-xl h-8 text-xs">
                                Close
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
