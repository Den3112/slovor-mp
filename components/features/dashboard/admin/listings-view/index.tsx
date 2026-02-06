'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    XCircle,
    Tag,
    AlertTriangle,
    UserPlus,
    Eye,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { listingsApi, adminApi, type Listing } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { type Column } from '@/components/features/dashboard/shared/data-grid';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatting';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sub-components
import { ListingsHeader } from './listings-header'
import { BulkActionsBar } from './bulk-actions-bar'
import { ModerationQueue } from './moderation-queue'
import { AdminListingsTable } from './admin-listings-table'
import { AdminListingsViewProps, SuspicionIssue } from './types'

export { ListingsHeader, BulkActionsBar, ModerationQueue, AdminListingsTable }
export * from './types'
export * from './moderation-card'

export function AdminListingsView({ initialListings = [] }: AdminListingsViewProps) {
    const { t, i18n } = useTranslation(['common', 'admin', 'profile']);
    const locale = i18n.language || 'en';
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [isLoading, setIsLoading] = useState(initialListings.length === 0);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Sorting state
    const [sortColumn, setSortColumn] = useState('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Load listings if not provided
    useEffect(() => {
        if (initialListings.length === 0) {
            loadListings();
        }
    }, [initialListings.length]);

    const loadListings = async () => {
        setIsLoading(true);
        const { data } = await listingsApi.getAdminAll();
        if (data) setListings(data);
        setIsLoading(false);
    };

    const handleAction = async (id: string, status: 'active' | 'rejected') => {
        const { error } = await listingsApi.update(id, { status });
        if (error) {
            toast.error(error);
        } else {
            const successMsg =
                status === 'active'
                    ? t('admin:listingApproved') || 'Listing approved'
                    : t('admin:listingRejected') || 'Listing rejected';

            toast.success(successMsg);
            setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

            adminApi.logAction({
                target_id: id,
                target_type: 'listing',
                action_type: status === 'active' ? 'approve' : 'reject',
                reason: status === 'active' ? 'Admin approved listing' : `Admin set status to ${status}`,
            });
        }
    };

    const handleBulkAction = async (status: 'active' | 'rejected') => {
        toast.promise(Promise.all(selectedIds.map((id) => listingsApi.update(id, { status }))), {
            loading: 'Processing bulk action...',
            success: () => {
                setListings((prev) =>
                    prev.map((l) => (selectedIds.includes(l.id) ? { ...l, status } : l))
                );
                setSelectedIds([]);
                return 'Bulk action completed successfully';
            },
            error: 'Failed to process some items',
        });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredListings.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredListings.map((l) => l.id));
        }
    };

    // Suspicion Logic
    const getSuspicion = (listing: Listing): SuspicionIssue[] => {
        const issues: SuspicionIssue[] = [];
        if (listing.price < 50 && listing.price > 0 && listing.currency === 'EUR') {
            issues.push({ label: 'Suspicious Price', color: 'bg-amber-500', icon: AlertTriangle });
        }
        if (!listing.images || listing.images.length === 0) {
            issues.push({ label: 'No Images', color: 'bg-destructive', icon: Tag });
        }
        const createdDate = new Date(listing.user?.created_at || '');
        const daysOld = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOld < 2) {
            issues.push({ label: 'New Seller', color: 'bg-blue-500', icon: UserPlus });
        }
        return issues;
    };

    // Filtering & Sorting
    const filteredListings = useMemo(() => {
        let result = listings;

        if (activeTab !== 'all') {
            if (activeTab === 'pending')
                result = result.filter((l) => l.status === 'draft' || l.status === 'pending');
            else result = result.filter((l) => l.status === activeTab);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (l) =>
                    l.title.toLowerCase().includes(q) ||
                    (l.user?.display_name?.toLowerCase() || '').includes(q)
            );
        }

        return [...result].sort((a, b) => {
            const aValue = a[sortColumn as keyof Listing];
            const bValue = b[sortColumn as keyof Listing];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (aValue === bValue) return 0;
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
        });
    }, [listings, activeTab, searchQuery, sortColumn, sortDirection]);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

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
            className: 'w-[40px]',
        },
        {
            key: 'title',
            header: t('admin:tableListing') || 'Listing',
            sortable: true,
            className: 'min-w-[400px]',
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
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                                {formatPrice(row.price)} {row.currency}
                            </span>
                            <span className="text-[11px] font-bold text-muted-foreground/20">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                {row.category_id}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'user',
            header: t('admin:tableSeller') || 'Seller',
            className: 'min-w-[160px]',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border/40">
                        <Users className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight truncate max-w-[120px]">
                            {row.user?.display_name || 'User'}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-wider">
                            {new Date(row.user?.created_at || '').toLocaleDateString(undefined, {
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: t('admin:tableStatus') || 'Status',
            sortable: true,
            cell: (row) => {
                const statusObj = {
                    active: {
                        bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                        label: 'Active',
                    },
                    pending: { bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Pending' },
                    draft: { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20', label: 'Draft' },
                    rejected: { bg: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' },
                };
                const current = (statusObj as any)[row.status] || statusObj.draft;
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            'px-2 py-0.5 border font-bold text-[9px] uppercase tracking-widest rounded-md',
                            current.bg
                        )}
                    >
                        {current.label}
                    </Badge>
                );
            },
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
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
            ),
        },
    ];

    const stats = [
        { value: 'all', label: 'All Listings', count: listings.length },
        {
            value: 'pending',
            label: 'Pending Review',
            count: listings.filter((l) => l.status === 'draft' || l.status === 'pending').length,
        },
        { value: 'active', label: 'Active', count: listings.filter((l) => l.status === 'active').length },
        {
            value: 'rejected',
            label: 'Rejected',
            count: listings.filter((l) => l.status === 'rejected').length,
        },
    ];

    return (
        <div className="space-y-8 pb-32">
            <ListingsHeader />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap border border-border/40">
                        {stats.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-lg px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
                            >
                                {tab.label}
                                <span
                                    className={cn(
                                        'ml-3 rounded-lg px-2 py-0.5 text-[9px] font-bold border',
                                        tab.value === 'pending' && tab.count > 0
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                            : 'bg-muted-foreground/5 text-muted-foreground/40 border-border/40'
                                    )}
                                >
                                    {tab.count}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {activeTab === 'pending' ? (
                    <ModerationQueue
                        listings={filteredListings}
                        isLoading={isLoading}
                        getSuspicion={getSuspicion}
                        handleAction={handleAction}
                        locale={locale}
                    />
                ) : (
                    <AdminListingsTable
                        columns={columns}
                        data={filteredListings}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onSearch={setSearchQuery}
                        isLoading={isLoading}
                    />
                )}
            </Tabs>

            <AnimatePresence>
                <BulkActionsBar
                    selectedCount={selectedIds.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelectedIds([])}
                />
            </AnimatePresence>
        </div>
    );
}
