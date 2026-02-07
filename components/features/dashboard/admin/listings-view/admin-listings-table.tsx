'use client'

import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Listing } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'

interface AdminListingsTableProps {
  columns: Column<Listing>[]
  data: Listing[]
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  onSearch: (query: string) => void
  isLoading: boolean
  searchPlaceholder?: string
}

export function AdminListingsTable({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onSearch,
  isLoading,
  searchPlaceholder,
}: AdminListingsTableProps) {
  const { t } = useTranslation(['admin'])

  return (
    <DataGrid
      columns={columns}
      data={data}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      onSearch={onSearch}
      searchPlaceholder={
        searchPlaceholder || t('admin:searchPlaceholderListings')
      }
      isLoading={isLoading}
      emptyMessage={t('admin:noListingsFound')}
      className="animate-in fade-in slide-in-from-bottom-2 transition-all duration-500"
    />
  )
}
