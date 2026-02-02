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
import { formatPrice } from '@/lib/utils/formatting'
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
                    className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
            ),
            cell: (row) => (
                <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                    aria-label={`Select ${row.title}`}
                    className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
            ),
            className: "w-[40px]"
        },
        {
            key: 'title',
            header: t('admin:tableListing'),
            sortable: true,
            className: "min-w-[340px]",
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/40 shadow-sm group-hover:border-primary/30 transition-colors">
                        {row.images?.[0] ? (
                            <Image src={row.images[0]} alt={row.title} fill className="object-cover" unoptimized />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                                <Tag className="h-5 w-5" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <Link
                            href={`/listings/${row.id}`}
                            target="_blank"
                            className="text-sm font-bold hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tight"
                        >
                            {row.title}
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-primary uppercase tracking-wider">
                                {formatPrice(row.price)} {row.currency}
                            </span>
                            <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                ID: {row.id.split('-')[0]}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'user',
            header: t('admin:tableSeller'),
            sortable: false,
            className: "min-w-[180px]",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <Users className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[120px]">
                            {row.user?.display_name || t('admin.unknown')}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            {t('admin:proSeller') || 'Member'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin:tableStatus'),
            sortable: true,
            cell: (row) => {
                const statusObj = {
                    active: {
                        bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                        dot: "bg-emerald-500",
                        label: t('admin:active')
                    },
                    draft: {
                        bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                        dot: "bg-amber-500",
                        label: 'Draft'
                    },
                    pending: {
                        bg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                        dot: "bg-blue-500",
                        label: 'Pending'
                    },
                    rejected: {
                        bg: "bg-destructive/10 text-destructive border-destructive/20",
                        dot: "bg-destructive",
                        label: t('admin:rejected')
                    },
                    expired: {
                        bg: "bg-muted text-muted-foreground border-border/40",
                        dot: "bg-muted-foreground/40",
                        label: 'Expired'
                    },
                    sold: {
                        bg: "bg-slate-500/10 text-slate-600 border-slate-500/20",
                        dot: "bg-slate-500",
                        label: 'Sold'
                    },
                }
                // @ts-ignore
                const current = statusObj[row.status] || statusObj.draft

                return (
                    <Badge variant="outline" className={cn("px-2.5 py-0.5 border font-bold text-[10px] uppercase tracking-widest rounded-md gap-1.5 flex items-center w-fit h-6", current.bg)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", current.dot)} />
                        {current.label}
                    </Badge>
                )
            }
        },
        {
            key: 'created_at',
            header: t('admin:tableDate'),
            sortable: true,
            cell: (row) => (
                <div className="flex flex-col text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-foreground">{new Date(row.created_at).toLocaleDateString()}</span>
                    <span className="text-muted-foreground/50">{new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: 'actions',
            header: <span className="sr-only">{t('admin:tableActions')}</span>,
            className: "text-right",
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    {row.status === 'active' || row.status === 'sold' ? (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAction(row.id, 'draft')}
                            className="bg-background hover:bg-amber-500/5 hover:text-amber-600 hover:border-amber-500/30 border-border/60 text-muted-foreground h-8 w-8 transition-all shrink-0"
                        >
                            <ShieldAlert className="h-3.5 w-3.5" />
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAction(row.id, 'active')}
                            className="bg-background hover:bg-emerald-500/5 hover:text-emerald-600 hover:border-emerald-500/30 border-border/60 text-muted-foreground h-8 w-8 transition-all shrink-0"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAction(row.id, 'rejected')}
                        className="bg-background hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 border-border/60 text-muted-foreground h-8 w-8 transition-all shrink-0"
                    >
                        <XCircle className="h-3.5 w-3.5" />
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
        <div className="space-y-8" data-testid="admin-listings-view">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                        <Layers className="h-8 w-8 text-primary" />
                        {t('admin:moderation')}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-warning" />
                        {t('admin:reviewManageListings')}
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6">
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start border border-border/40">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                {tab.label}
                                <span className={cn(
                                    "ml-2 rounded px-1.5 py-0.5 text-[9px] font-black border",
                                    tab.value === 'pending' && tab.count > 0
                                        ? "bg-warning/10 text-warning border-warning/20"
                                        : "bg-muted-foreground/5 text-muted-foreground/40 border-border/40"
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
                    searchPlaceholder={t('admin:searchPlaceholderListings')}
                    isLoading={isLoading}
                    emptyMessage="No listings found matching criteria."
                />
            </Tabs>

            {/* Floating Bulk Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-50 bg-foreground text-background px-6 py-3 rounded-xl shadow-sm flex items-center gap-6 border border-border"
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-[11px] font-black text-primary-foreground">
                                {selectedIds.length}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-background/60">Selected Items</span>
                        </div>
                        <div className="h-6 w-px bg-background/20" />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleBulkAction('active')} className="bg-success hover:bg-success/90 text-white rounded-lg h-9 px-4 text-[10px] font-black uppercase tracking-widest border-0">
                                Approve All
                            </Button>
                            <Button size="sm" onClick={() => handleBulkAction('rejected')} variant="destructive" className="rounded-lg h-9 px-4 text-[10px] font-black uppercase tracking-widest border-0">
                                Reject All
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="text-background/60 hover:text-background rounded-lg h-9 px-4 text-[10px] font-black uppercase tracking-widest hover:bg-background/10">
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
