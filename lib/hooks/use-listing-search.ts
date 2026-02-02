import { useState, useEffect } from 'react'
import { searchListings } from '@/lib/actions/search-listings'
import type { Listing } from '@/lib/types/database'

export function useListingSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery)
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
    const [results, setResults] = useState<Partial<Listing>[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    // Search Effect
    useEffect(() => {
        const performSearch = async () => {
            // Only search if query is long enough
            if (debouncedQuery.trim().length < 2) {
                setResults([])
                setError(null)
                setIsSearching(false)
                return
            }

            setIsSearching(true)
            setError(null)

            try {
                const { data, error: searchError } = await searchListings(debouncedQuery)

                if (searchError) {
                    setError(searchError)
                    setResults([])
                } else {
                    setResults(data || [])
                }
            } catch (err) {
                setError('An unexpected error occurred')
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }

        performSearch()
    }, [debouncedQuery])

    return {
        query,
        setQuery,
        results,
        isSearching,
        error
    }
}
