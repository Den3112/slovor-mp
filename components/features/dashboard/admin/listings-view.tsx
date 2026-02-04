'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Layers, CheckCircle2, XCircle,
    Tag, AlertTriangle, UserPlus, Clock, ChevronRight, Eye, Ban, Edit3, UserCircle
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
    const { t, locale } = useTranslation(['common', 'admin', 'profile'])
    const [listings, setListings] = useState<Listing[]>(initialListings)
    const [isLoading, setIsLoading] = useState(initialListings.length === 0)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all') // all, pending, active, rejected
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Sorting state
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Load listings if not provided
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
            const successMsg = status === 'active'
                ? t('admin:listingApproved') || 'Listing approved'
                : t('admin:listingRejected') || 'Listing rejected'

            toast.success(successMsg)
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

    // Suspicion Logic
    const getSuspicion = (listing: Listing) => {
        const issues = []
        if (listing.price < 50 && listing.price > 0 && listing.currency === 'EUR') {
            issues.push({ label: 'Suspicious Price', color: 'bg-amber-500', icon: AlertTriangle })
        }
        if (!listing.images || listing.images.length === 0) {
            issues.push({ label: 'No Images', color: 'bg-destructive', icon: Tag })
        }
        const createdDate = new Date(listing.user?.created_at || '')
        const daysOld = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        if (daysOld < 2) {
            issues.push({ label: 'New Seller', color: 'bg-blue-500', icon: UserPlus })
        }
        return issues
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
        return [...result].sort((a, b) => {
            const aValue = a[sortColumn as keyof Listing]
            const bValue = b[sortColumn as keyof Listing]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
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

    // Column Definitions for Table View
    const columns: Column<Listing>[] = [
        {
            key: 'select',
            header: (
                <Checkbox
                    checked={filteredListings.length > 0 && selectedIds.length === filteredListings.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    className="border-border/60"
                />
            ),
            cell: (row) => (
                <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                    aria-label={`Select ${row.title}`}
                    className="border-border/60"
                />
            ),
            className: "w-[40px]"
        },
        {
            key: 'title',
            header: t('admin:tableListing') || 'Listing',
            sortable: true,
            className: "min-w-[400px]",
            cell: (row) => (
                <div className="flex items-center gap-4 group/item">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/40 transition-all group-hover/item:border-primary/30">
                        {row.images?.[0] ? (
                            <Image src={row.images[0]} alt={row.title} fill className="object-cover" unoptimized />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                                <Tag className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1">
                        <Link
                            href={`/${locale}/listings/${row.id}`}
                            target="_blank"
                            className="text-sm font-bold hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tight flex items-center gap-2"
                        >
                            {row.title}
                            <Eye className="h-3 w-3 opacity-0 group-hover/item:opacity-40" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-primary uppercase tracking-wider">
                                {formatPrice(row.price)} {row.currency}
                            </span>
                            <span className="text-[11px] font-bold text-muted-foreground/20">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{row.category_id}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'user',
            header: t('admin:tableSeller') || 'Seller',
            className: "min-w-[160px]",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border/40">
                        <Users className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight truncate max-w-[120px]">
                            {row.user?.display_name || 'User'}
                        </span>
                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-wider">
                            {new Date(row.user?.created_at || '').toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin:tableStatus') || 'Status',
            sortable: true,
            cell: (row) => {
                const statusObj = {
                    active: { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: 'Active' },
                    pending: { bg: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: 'Pending' },
                    draft: { bg: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: 'Draft' },
                    rejected: { bg: "bg-destructive/10 text-destructive border-destructive/20", label: 'Rejected' },
                }
                const current = (statusObj as any)[row.status] || statusObj.draft
                return (
                    <Badge variant="outline" className={cn("px-2 py-0.5 border font-black text-[9px] uppercase tracking-widest rounded-md", current.bg)}>
                        {current.label}
                    </Badge>
                )
            }
        },
        {
            key: 'actions',
            header: '',
            className: "text-right",
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAction(row.id, 'active')}
                        className="h-8 w-8 border-border/40 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/20 transition-all rounded-lg"
                        title="Approve"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAction(row.id, 'rejected')}
                        className="h-8 w-8 border-border/40 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all rounded-lg"
                        title="Reject"
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    const stats = [
        { value: 'all', label: 'All Listings', count: listings.length },
        { value: 'pending', label: 'Pending Review', count: listings.filter(l => l.status === 'draft' || l.status === 'pending').length },
        { value: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length },
        { value: 'rejected', label: 'Rejected', count: listings.filter(l => l.status === 'rejected').length },
    ]

    return (
        <div className="space-y-8 pb-32">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black italic tracking-tighter text-foreground uppercase flex items-center gap-3">
                    <Layers className="h-8 w-8 text-primary" strokeWidth={2.5} />
                    {t('admin:moderation') || 'Moderation'}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                    {t('admin:reviewManageListings') || 'Review and manage marketplace content'}
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
                    <TabsList className="bg-muted/40 p-1 rounded-2xl h-auto flex-wrap border border-border/40">
                        {stats.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all"
                            >
                                {tab.label}
                                <span className={cn(
                                    "ml-3 rounded-lg px-2 py-0.5 text-[9px] font-black border",
                                    tab.value === 'pending' && tab.count > 0
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-muted-foreground/5 text-muted-foreground/40 border-border/40"
                                )}>
                                    {tab.count}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* MODERATION MODE - Card based for Pending */}
                {activeTab === 'pending' ? (
                    <div className="grid grid-cols-1 gap-6">
                        {isLoading ? (
                            <div className="flex h-64 items-center justify-center rounded-3xl border-2 border-dashed border-border/40">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading queue...</span>
                                </div>
                            </div>
                        ) : filteredListings.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border/40 bg-muted/5">
                                <CheckCircle2 className="h-12 w-12 text-muted-foreground/20" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Queue is clear! Well done.</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {filteredListings.map((listing) => {
                                    const issues = getSuspicion(listing)
                                    return (
                                        <motion.div
                                            key={listing.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative flex flex-col bg-card rounded-4xl border border-border/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
                                        >
                                            {/* Status Badge Overlays */}
                                            {issues.map((issue, idx) => (
                                                <div key={idx} className={cn("absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-xl", issue.color)}>
                                                    <issue.icon className="h-3 w-3" />
                                                    {issue.label}
                                                </div>
                                            ))}

                                            {/* Image & Main Info */}
                                            <div className="flex gap-6 p-6">
                                                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border/40">
                                                    {listing.images?.[0] ? (
                                                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                                                    ) : (
                                                        <Tag className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground/20" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col justify-between py-1">
                                                    <div className="space-y-1">
                                                        <h3 className="text-lg font-black tracking-tight leading-tight line-clamp-2">{listing.title}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-black text-primary uppercase">{formatPrice(listing.price)} {listing.currency}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">({listing.category_id})</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {new Date(listing.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description & Metadata */}
                                            <div className="px-6 pb-6 space-y-4">
                                                <div className="bg-muted/30 rounded-2xl p-4 border border-border/40">
                                                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed italic">
                                                        &quot;{listing.description || 'No description provided.'}&quot;
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between py-2 border-y border-border/40">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                            <UserCircle className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black tracking-tight">{listing.user?.display_name || 'Seller'}</span>
                                                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Joined {new Date(listing.user?.created_at || '').getFullYear()}</span>
                                                        </div>
                                                    </div>
                                                    <Link href={`/${locale}/listings/${listing.id}`} target="_blank" className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70">
                                                        Full Details <ChevronRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="mt-auto grid grid-cols-2 gap-px bg-border/40 border-t border-border/40">
                                                <button
                                                    onClick={() => handleAction(listing.id, 'active')}
                                                    className="flex items-center justify-center gap-2 py-5 bg-background hover:bg-emerald-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group/btn"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(listing.id, 'rejected')}
                                                    className="flex items-center justify-center gap-2 py-5 bg-background hover:bg-destructive hover:text-white transition-all text-xs font-black uppercase tracking-widest group/btn"
                                                >
                                                    <XCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                                    Reject
                                                </button>
                                            </div>

                                            {/* Sub-actions Overlay (More) */}
                                            <div className="flex items-center justify-around border-t border-border/40 bg-muted/20 p-2">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-background text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                                                    <Edit3 className="h-3.5 w-3.5" /> Request Fix
                                                </button>
                                                <div className="h-4 w-px bg-border/60" />
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-background text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all">
                                                    <Ban className="h-3.5 w-3.5" /> Ban Seller
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* REGULAR TABLE VIEW - For All, Active, Rejected */
                    <DataGrid
                        columns={columns}
                        data={filteredListings}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onSearch={setSearchQuery}
                        searchPlaceholder={t('admin:searchPlaceholderListings') || 'Filter listings...'}
                        isLoading={isLoading}
                        emptyMessage="No matching listings found."
                        className="transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
                    />
                )}
            </Tabs>

            {/* Floating Bulk Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 100, x: '-50%' }}
                        className="fixed bottom-12 left-1/2 z-50 bg-foreground text-background px-8 py-4 rounded-4xl shadow-2xl flex items-center gap-8 border border-white/10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-sm font-black text-primary-foreground shadow-lg shadow-primary/20">
                                {selectedIds.length}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Selected items</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex gap-3">
                            <Button size="sm" onClick={() => handleBulkAction('active')} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest border-0">
                                Approve All
                            </Button>
                            <Button size="sm" onClick={() => handleBulkAction('rejected')} variant="destructive" className="rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest border-0">
                                Reject All
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="text-white/40 hover:text-white rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                                Dismiss
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
