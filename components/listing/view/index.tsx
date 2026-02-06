'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { listingsApi, type ListingFilterOptions } from '@/lib/api/listings';
import { Container } from '@/components/ui/container';
import type { Listing, Category } from '@/lib/types/database';

// Sub-components
import { ListingsHeader } from './listings-header';
import { MobileFilterDrawer } from './mobile-filter-drawer';
import { FilterSidebar } from './filter-sidebar';
import { ListingsGrid } from './listings-grid';

const ITEMS_PER_PAGE = 12;

interface Props {
    initialListings: Listing[];
    totalCount: number;
    categories: Category[];
    error: string | null;
    searchQuery?: string;
    filters?: ListingFilterOptions;
}

export function ListingsView({
    initialListings,
    totalCount,
    categories,
    error,
    searchQuery,
    filters,
}: Props) {
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const hasMore = listings.length < totalCount;

    /* Infinite Scroll Logic */
    const observerTarget = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const resetRef = useRef(0);

    const loadMore = useCallback(async () => {
        // Use ref for immediate blocking to prevent race conditions
        if (loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        setLoading(true);
        const currentResetId = resetRef.current;

        try {
            const nextPage = page + 1;
            const result = await listingsApi.getAll({
                ...filters,
                page: nextPage,
                limit: ITEMS_PER_PAGE,
            });

            // Check if filters changed while we were fetching
            if (currentResetId !== resetRef.current) return;

            if (result.data && result.data.length > 0) {
                setListings((prev) => {
                    // Double check resetId inside setter just in case
                    if (currentResetId !== resetRef.current) return prev;

                    // Filter out any potential duplicates by ID
                    const existingIds = new Set(prev.map((l) => l.id));
                    const newUnique = (result.data || []).filter((l) => !existingIds.has(l.id));
                    return [...prev, ...newUnique];
                });
                setPage(nextPage);
            }
        } catch (err) {
            console.error('Failed to load more listings:', err);
        } finally {
            if (currentResetId === resetRef.current) {
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, [hasMore, page, filters]);

    // Reset state when initialListings changes
    useEffect(() => {
        resetRef.current += 1;
        setListings(initialListings);
        setPage(1);
        setLoading(false);
        loadingRef.current = false;
    }, [initialListings]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore && !loadingRef.current) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loadMore]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <ListingsHeader searchQuery={searchQuery} totalCount={totalCount} filters={filters} />

            <Container>
                <MobileFilterDrawer
                    categories={categories}
                    totalCount={totalCount}
                    isOpen={filterOpen}
                    onOpenChange={setFilterOpen}
                />

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <FilterSidebar categories={categories} />

                    <ListingsGrid
                        listings={listings}
                        error={error}
                        loading={loading}
                        hasMore={hasMore}
                        observerTarget={observerTarget}
                    />
                </div>
            </Container>
        </div>
    );
}
