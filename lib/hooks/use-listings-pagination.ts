import { useState, useCallback, useRef, useEffect } from 'react'
import { listingsApi, type ListingFilterOptions } from '@/lib/api/listings'
import type { Listing } from '@/lib/api'

const ITEMS_PER_PAGE = 12

interface UseListingsPaginationProps {
    initialListings: Listing[]
    totalCount: number
    filters?: ListingFilterOptions
}

export function useListingsPagination({
    initialListings,
    totalCount,
    filters
}: UseListingsPaginationProps) {
    const [listings, setListings] = useState<Listing[]>(initialListings)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const hasMore = listings.length < totalCount
    const loadingRef = useRef(false)
    const resetRef = useRef(0)
    const observerTarget = useRef<HTMLDivElement>(null)

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore) return

        loadingRef.current = true
        setLoading(true)
        const currentResetId = resetRef.current

        try {
            const nextPage = page + 1
            const result = await listingsApi.getAll({
                ...filters,
                page: nextPage,
                limit: ITEMS_PER_PAGE,
            })

            if (currentResetId !== resetRef.current) return

            if (result.data && result.data.length > 0) {
                setListings((prev) => {
                    if (currentResetId !== resetRef.current) return prev
                    const existingIds = new Set(prev.map(l => l.id))
                    const newUnique = (result.data || []).filter(l => !existingIds.has(l.id))
                    return [...prev, ...newUnique]
                })
                setPage(nextPage)
            }
        } catch (err) {
            console.error('Failed to load more listings:', err)
        } finally {
            if (currentResetId === resetRef.current) {
                loadingRef.current = false
                setLoading(false)
            }
        }
    }, [hasMore, page, filters])

    useEffect(() => {
        resetRef.current += 1
        setListings(initialListings)
        setPage(1)
        setLoading(false)
        loadingRef.current = false
    }, [initialListings])

    // Built-in observer logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore && !loadingRef.current) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        )

        const currentTarget = observerTarget.current
        if (currentTarget) observer.observe(currentTarget)

        return () => {
            if (currentTarget) observer.unobserve(currentTarget)
        }
    }, [hasMore, loadMore])

    return {
        listings,
        loading,
        hasMore,
        loadMore,
        observerTarget,
        ITEMS_PER_PAGE
    }
}
