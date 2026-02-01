'use client'

import { useState, useMemo } from 'react'
import { Plus, Package, Eye, Heart, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

export function UserListingsView({ initialListings = [] }: UserListingsViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing'])
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

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
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard:myListings')}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{t('dashboard:inventoryDescription')}</p>
                </div>
                <Button asChild>
                    <Link href="/post">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="bg-muted p-1 rounded-lg h-auto flex-wrap justify-start">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all px-3 py-1.5 h-auto text-sm"
                            >
                                {tab.label}
                                <span className="ml-2 py-0.5 text-xs text-muted-foreground">
                                    {tab.count}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('common:search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[400px] text-xs uppercase">{t('common:title')}</TableHead>
                            <TableHead className="text-xs uppercase">{t('createListing:price')}</TableHead>
                            <TableHead className="text-xs uppercase">{t('dashboard:status')}</TableHead>
                            <TableHead className="text-xs uppercase">{t('dashboard:views')}</TableHead>
                            <TableHead className="text-xs uppercase">{t('common:date')}</TableHead>
                            <TableHead className="text-xs uppercase text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredListings.length > 0 ? (
                            filteredListings.map((listing) => (
                                <TableRow key={listing.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                                {listing.images?.[0] ? (
                                                    <Image
                                                        src={listing.images[0]}
                                                        alt={listing.title}
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
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="block truncate font-medium hover:text-primary transition-colors max-w-[200px] sm:max-w-md"
                                                >
                                                    {listing.title}
                                                </Link>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm">{listing.price} {listing.currency}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={listing.is_active ? 'success' : 'secondary'} className="rounded-md font-normal">
                                            {listing.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" /> {listing.views_count || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="h-3 w-3" /> {listing.favorites_count || 0}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ListingRowActions listing={listing} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    {t('dashboard:noListingsYet')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
