'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string | React.ReactNode
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataGridProps<T> {
  columns: Column<T>[]
  data: T[]
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (columnKey: string) => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function DataGrid<T extends { id: string | number }>({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onSearch,
  searchPlaceholder = 'Search...',
  isLoading,
  emptyMessage = 'No data found',
  className,
}: DataGridProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Bar / Filters Area */}
      {onSearch && (
        <div className="flex items-center gap-4">
          <div className="group relative max-w-sm flex-1">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              className="bg-card border-border/60 focus-visible:ring-primary/20 h-10 pl-9 text-xs font-bold tracking-widest uppercase"
              onChange={(e) => onSearch(e.target.value)}
              aria-label={searchPlaceholder}
            />
          </div>
        </div>
      )}

      <div className="border-border/60 bg-card overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/10 border-border/40 border-b">
            <TableRow className="h-12 border-0 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(col.className, 'px-6 whitespace-nowrap')}
                >
                  {col.sortable && onSort ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground data-[state=open]:bg-accent -ml-3 h-8 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-transparent"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      {sortColumn === col.key ? (
                        sortDirection === 'desc' ? (
                          <ChevronDown className="text-primary ml-2 h-3.5 w-3.5" />
                        ) : (
                          <ChevronUp className="text-primary ml-2 h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-20 group-hover:opacity-100" />
                      )}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      {col.header}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/40">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-6 py-4">
                      <div className="bg-muted/40 h-4 w-full animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className="group hover:bg-muted/10 border-border/40 transition-colors"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={`${row.id}-${col.key}`}
                      className={cn(
                        col.className,
                        'px-6 py-4 transition-colors'
                      )}
                    >
                      {col.cell ? (
                        col.cell(row)
                      ) : (
                        <span className="text-sm font-medium tracking-tight">
                          {(row as any)[col.key]}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center text-xs font-bold tracking-widest uppercase"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
