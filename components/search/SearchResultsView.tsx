'use client'

import { ListingCard } from '@/components/listing/card'
import { Pagination } from '@/components/category/Pagination'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/api'

interface SearchResultsViewProps {
  listings: Listing[]
  totalCount: number
  itemsPerPage: number
}

export function SearchResultsView({
  listings,
  totalCount,
  itemsPerPage,
}: SearchResultsViewProps) {
  const { t } = useTranslation()

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted mb-4 rounded-full p-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h2 className="mb-2 text-xl font-bold">
          {t.common.noResults || 'No results found'}
        </h2>
        <p className="text-muted-foreground">
          {t.common.tryDifferentFilters ||
            'Try adjusting your filters or search terms.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Header for Search Results */}
      {/* Note: In the original page.tsx, the header was outside the results block.
          We might want to keep the header in page.tsx if it's structural,
          OR move it here if it needs to be dynamic.
          The original page had "Search results for..." in the header section.
          Let's include a sub-header or summary here, or rely on the parent.

          Actually, the Plan said: "Implement useTranslation hook to handle: 'Showing results' text".
          The main header "Search results for..." was in the page layout.
          Let's see if we can control that.

          In the original page.tsx, the header was:
            <h1 ...> {query ? `Search results for "${query}"` : 'All Listings'} </h1>
          This header is distinct from the results grid.

          However, to make that header dynamic, it MUST be in a Client Component.
          So purely putting logic in SearchResultsView is not enough if the header stays in page.tsx (server).

          I should probably move the Header rendering INTO this component or a separate one.
          For simplicity and cohesion, I'll include the header/summary logic here OR
          better yet, the plan implied moving the *rendering logic*.

          Let's look at `app/search/page.tsx` again.
          It has a `<div className="py-8 border-b bg-white">...<h1>...</h1></div>` separate from `SearchLayout`.

          If I only make `SearchResultsView` generic, the top header remains static.
          I should probably refactor the *Page* to pass data to a top-level `SearchPageContent` or similar,
          OR make `SearchResultsView` handle the *entire* content area inside `SearchLayout` and generic layout?

          Actually, the plan said: "Move the UI rendering logic from app/search/page.tsx to this component."

          If I look at `app/search/page.tsx`:
          It renders `Container` -> `Header Div` -> `SearchLayout`.

          If I want the Header to be dynamic, `SearchResultsView` shouldn't just be the results list.
          It should probably be the whole view or I need a separate `SearchHeader` component.

          Let's try to make `SearchResultsView` encapsulate the list part (from line 97 downwards in original `page.tsx`).
          AND I'll create a `SearchHeader` component? Or just put the header inside `SearchLayout`?

          No, the header is distinct.

          Let's make `SearchResultsView` cover the `div.space-y-8` which includes the list and pagination.
          Wait, the "Showing results" text (line 101 in page.tsx) is also needing translation.

          So, `SearchResultsView` should replace the content INSIDE `SearchLayout`.

          What about the top header? `Search results for "..."`
          That is outside `SearchLayout`.
          I should create a `SearchHeader` client component as well, or just include it in `SearchResultsView` and change the layout structure?
          Changing layout structure might be risky if I don't look at `SearchLayout`.

          Let's assume `SearchLayout` expects children.

          I'll create `SearchHeader.tsx` as well? No, that wasn't in the plan.
          The plan said "Move the UI rendering logic...".

          Let's make `app/search/page.tsx` pass data to a SINGLE `SearchPageView` that wraps everything inside `Container`?
          That would be the cleanest way to make *everything* dynamic.

          But `SearchLayout` takes a sidebar prop.

          Let's stick to the plan: `SearchResultsView`.
          But I'll notice the header issue.

          I will IMPLEMENT `SearchResultsView` to handle the `SearchLayout` children (results count, sort, list, pagination).
          AND I will *also* Update the implementation to fix the Header.
          I'll just wrap the Header in a small Client Component or include it in the main View if I refactor potentially more.

          Actually, I can just make a small inline Client Component for the header in `app/search/page.tsx`?
          No, Next.js doesn't like defining components inside other files usually if they need `use client`.

          Let's create `components/search/search-header.tsx` as an un-planned but necessary extra step to fulfill the "Global Dynamic Localization" goal.
          I'll add it to the implementation plan implicitly or just do it. I'll do it.

          So first, `SearchResultsView.tsx`.
      */}

      <div className="mb-6 flex items-center justify-between">
        <span className="text-muted-foreground font-medium">
          {/* "Showing results" */}
          {t.common.showingResults || 'Showing results'}
        </span>
        {/* SortSelect is already a component, likely client? Let's check imports in page.tsx.
            It was imported from '@/components/search/sort-select'.
            I'll assume it's good or I'll check it later.
            I need to include it here.
        */}
        <SortSelectWrapper />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
    </div>
  )
}

// I need SortSelect.
// I'll assume SortSelect is a client component since it handles interaction.
import { SortSelect } from '@/components/search/SortSelect'

function SortSelectWrapper() {
  return <SortSelect />
}
