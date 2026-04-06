import { SlidersHorizontal } from 'lucide-react'
import { ListingFilters } from '@/features/search'
import { useTranslation } from '@/shared/lib/i18n'
import { FilterSidebarProps } from './types'
import { memo } from 'react'

export const FilterSidebar = memo(function FilterSidebar({
  categories,
}: FilterSidebarProps) {
  const { t } = useTranslation(['filters'])

  return (
    <aside className="hidden space-y-8 lg:col-span-3 lg:block">
      <div className="sticky top-28">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <SlidersHorizontal className="text-primary h-5 w-5" />
            {t('filters:title')}
          </h2>
        </div>
        <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
          <ListingFilters categories={categories} />
        </div>
      </div>
    </aside>
  )
})

FilterSidebar.displayName = 'FilterSidebar'
