'use client';

import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { ListingsRow } from './listings-row';
import { ListingsEmpty } from './listings-empty';
import { Listing } from './types';
import { useTranslation } from '@/lib/i18n';

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

interface ListingsTableProps {
    listings: Listing[];
    paginatedListings: Listing[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    locale: string;
}

export function ListingsTable({
    listings,
    paginatedListings,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    locale,
}: ListingsTableProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing']);

    return (
        <div className="space-y-6">
            <motion.div variants={item} className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/40">
                                <TableHead className="w-12 px-4 h-10 text-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-border/60 bg-background accent-primary cursor-pointer"
                                        checked={selectedIds.length === listings.length && listings.length > 0}
                                        onChange={onToggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="px-4 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {t('common:title')}
                                </TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {t('createListing:price')}
                                </TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {t('dashboard:status')}
                                </TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {t('dashboard:stats')}
                                </TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {t('common:date')}
                                </TableHead>
                                <TableHead className="px-6 h-10 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedListings.length > 0 ? (
                                paginatedListings.map((listing) => (
                                    <ListingsRow
                                        key={listing.id}
                                        listing={listing}
                                        selected={selectedIds.includes(listing.id)}
                                        onToggle={() => onToggleSelect(listing.id)}
                                        locale={locale}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="p-0">
                                        <ListingsEmpty />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>

            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={listings.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
