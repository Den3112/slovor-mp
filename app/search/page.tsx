import { Suspense } from 'react'
import { SearchLayout } from '@/components/search/SearchLayout'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SortSelect } from '@/components/search/SortSelect'
import { listingsApi } from '@/lib/api'
import { ListingCard } from '@/components/listing/card'
import { Container } from '@/components/ui/container'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/category/Pagination'

// Fetch data on the server
async function SearchResults({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { q, category, minPrice, maxPrice, condition, location, sort, page } = searchParams
    const itemsPerPage = 12

    const { data: result } = await listingsApi.getAll({
        page: Number(page) || 1,
        limit: itemsPerPage,
        search: q,
        categorySlug: category,
        priceMin: minPrice ? Number(minPrice) : undefined,
        priceMax: maxPrice ? Number(maxPrice) : undefined,
        condition: condition as 'new' | 'used',
        location,
        sort
    })

    const listings = result?.items || []
    const total = result?.total || 0

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 rounded-full p-6 mb-4">
                    <span className="text-4xl">🔍</span>
                </div>
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>

            <Pagination totalItems={total} itemsPerPage={itemsPerPage} />
        </div>
    )
}

function SearchLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function SearchPage(props: SearchPageProps) {
    const searchParams = await props.searchParams
    const query = searchParams.q || ''

    return (
        <Container className="bg-gray-50/50 min-h-screen">
            {/* Header Section */}
            <div className="py-8 border-b bg-white">
                <Container>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        {query ? `Search results for "${query}"` : 'All Listings'}
                    </h1>
                </Container>
            </div>

            <SearchLayout sidebar={<SearchFilters />}>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium">
                        {/* We'll load total count inside Suspense later or pass it up if possible,
                    for now keeping it simple */}
                        Showing results
                    </span>
                    <SortSelect />
                </div>

                <Suspense fallback={<SearchLoading />}>
                    <SearchResults searchParams={searchParams} />
                </Suspense>
            </SearchLayout>
        </Container>
    )
}
