'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from 'nuqs'
import { createClient } from '@/shared/lib/supabase/client'
import { useDebounce } from '@/shared/lib/hooks/use-debounce' // Need to create this or use a simple one

const ITEMS_PER_PAGE = 12

export function useListingsSearch() {
  const supabase = createClient()

  const [filters, setFilters] = useQueryStates(
    {
      query: parseAsString.withDefault(''),
      category: parseAsString.withDefault(''),
      region: parseAsString.withDefault(''),
      city: parseAsString.withDefault(''),
      priceMin: parseAsInteger,
      priceMax: parseAsInteger,
      condition: parseAsArrayOf(parseAsString).withDefault([]),
      sort: parseAsString.withDefault('newest'),
    },
    {
      shallow: true,
      history: 'push',
    }
  )

  const debouncedQuery = useDebounce(filters.query, 300)

  const fetchListings = async ({ pageParam = 0 }) => {
    let query = supabase
      .from('listings')
      .select(
        '*, profiles(first_name, last_name, avatar_url), listings_images(*)',
        { count: 'exact' }
      )
      .eq('status', 'active')

    if (debouncedQuery) {
      query = query.ilike('title', `%${debouncedQuery}%`)
    }

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.region) {
      query = query.eq('location_region', filters.region)
    }

    if (filters.city) {
      query = query.eq('location_city', filters.city)
    }

    if (filters.priceMin !== null) {
      query = query.gte('price', filters.priceMin)
    }

    if (filters.priceMax !== null) {
      query = query.lte('price', filters.priceMax)
    }

    if (filters.condition.length > 0) {
      query = query.in('condition', filters.condition)
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const from = pageParam * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const { data, error, count } = await query.range(from, to)

    if (error) throw error

    return {
      data,
      nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      totalCount: count,
    }
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: ['listings', debouncedQuery, filters],
    queryFn: fetchListings,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    placeholderData: (previousData) => previousData,
  })

  const updateFilter = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters)
  }

  const resetFilters = () => {
    setFilters({
      query: '',
      category: '',
      region: '',
      city: '',
      priceMin: null,
      priceMax: null,
      condition: [],
      sort: 'newest',
    })
  }

  return {
    listings: data?.pages.flatMap((page) => page.data) || [],
    totalCount: data?.pages[0]?.totalCount || 0,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    status,
    filters,
    updateFilter,
    resetFilters,
  }
}

export { useListingsSearch as useListingSearch }
