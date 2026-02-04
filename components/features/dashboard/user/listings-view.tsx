'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, Eye, Heart, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Pagination } from '@/components/ui/pagination'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ListingRowActions } from '@/components/features/dashboard/user/components/listing-row-actions'

interface UserListingsViewProps {
    initialListings: any[]
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export function UserListingsView({ initialListings = [] }: UserListingsViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing'])
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredListings.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredListings.map(l => l.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} listings?`)) return
        // Implement real bulk delete here
        toast.success(`${selectedIds.length} listings deleted`)
        setSelectedIds([])
    }

    // Filter listings based on tab and search
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

        return result
    }, [initialListings, activeTab, searchQuery])

    // Paginated listings
    const paginatedListings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredListings.slice(start, start + itemsPerPage)
    }, [filteredListings, currentPage])

    const totalPages = Math.ceil(filteredListings.length / itemsPerPage)

    const tabs = [
        { value: 'all', label: t('dashboard:all'), count: initialListings.length },
        { value: 'active', label: t('dashboard:active'), count: initialListings.filter(l => l.status === 'active').length },
        { value: 'draft', label: t('dashboard:drafts'), count: initialListings.filter(l => l.status === 'draft' || l.status === 'pending').length },
        { value: 'sold', label: t('dashboard:sold'), count: initialListings.filter(l => l.status === 'sold').length },
        { value: 'archived', label: t('dashboard:archived'), count: initialListings.filter(l => l.status === 'expired' || l.status === 'rejected').length },
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
            data-testid="user-listings-view"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{t('dashboard:myListings')}</h1>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t('dashboard:inventoryDescription')}</p>
                </div>
                <Button asChild className="shadow-lg shadow-primary/20">
                    <Link href="/post">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </motion.div>

            {/* Controls */}
            <motion.div variants={item} className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-4 rounded-xl border border-border/60 shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                    <TabsList className="bg-muted/50 p-1 rounded-lg h-auto flex-wrap justify-start border border-border/20">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all px-4 py-2 h-auto text-[9px] font-black uppercase tracking-widest"
                            >
                                {tab.label}
                                <Badge variant="secondary" className="ml-2 px-1.5 py-0 h-4 min-w-5 border-transparent bg-muted/80 text-[8px] font-black">
                                    {tab.count}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="flex gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                            placeholder={t('common:search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 border-border/60 focus:ring-primary/20 rounded-xl"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 min-w-[320px] max-w-[90vw]"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Bulk actions</span>
                        <span className="text-xs font-bold text-white">{selectedIds.length} items selected</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl"
                            onClick={() => setSelectedIds([])}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="bg-white text-slate-900 hover:bg-white/90 text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl"
                        >
                            Deactivate
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl"
                            onClick={handleBulkDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Table */}
            <motion.div variants={item} className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/40">
                                <TableHead className="w-12 px-4 h-10 text-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-border/60 bg-background accent-primary cursor-pointer"
                                        checked={selectedIds.length === filteredListings.length && filteredListings.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="px-4 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{t('common:title')}</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{t('createListing:price')}</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{t('dashboard:status')}</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{t('dashboard:stats')}</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{t('common:date')}</TableHead>
                                <TableHead className="px-6 h-10 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedListings.length > 0 ? (
                                paginatedListings.map((listing) => (
                                    <TableRow key={listing.id} className={cn("hover:bg-accent/40 border-b border-border/40 transition-colors group", selectedIds.includes(listing.id) && "bg-primary/5")}>
                                        <TableCell className="w-12 px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-border/60 bg-background accent-primary cursor-pointer"
                                                checked={selectedIds.includes(listing.id)}
                                                onChange={() => toggleSelect(listing.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/10 bg-muted shadow-sm">
                                                    {listing.images?.[0] ? (
                                                        <Image
                                                            src={listing.images[0]}
                                                            alt={listing.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                                                            <Package className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 space-y-0.5">
                                                    <Link
                                                        href={`/listings/${listing.id}`}
                                                        className="block truncate font-bold text-sm hover:text-primary transition-colors max-w-[180px] sm:max-w-xs md:max-w-md"
                                                    >
                                                        {listing.title}
                                                    </Link>
                                                    <div className="flex items-center gap-2">
                                                        {listing.category?.name && (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                                                                {listing.category.name}
                                                            </span>
                                                        )}
                                                        <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">#{listing.id.split('-')[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 sm:px-6">
                                            <span className="font-heading text-base font-black tracking-tight whitespace-nowrap">
                                                {listing.price.toLocaleString()} {listing.currency}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 sm:px-6">
                                            <Badge
                                                variant={listing.status === 'active' ? 'success' : listing.status === 'sold' ? 'secondary' : 'outline'}
                                                className={cn(
                                                    "rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm",
                                                    listing.status === 'active' ? "bg-success/10 text-success border-success/20" :
                                                        listing.status === 'sold' ? "bg-muted/50 text-muted-foreground border-border/60" :
                                                            "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                )}
                                            >
                                                {listing.status || 'unknown'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 sm:px-6">
                                            <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/70">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-help">
                                                        <Eye className="h-3 w-3" /> {listing.views_count || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-help">
                                                        <Heart className="h-3 w-3" /> {listing.favorites_count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 sm:px-6">
                                            <span className="text-muted-foreground/60 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                                                {new Date(listing.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <ListingRowActions listing={listing} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Package className="h-10 w-10 opacity-20 mb-3" />
                                            <p className="text-sm font-medium">{t('dashboard:noListingsYet')}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredListings.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </motion.div>
    )
}
