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
    searchPlaceholder = "Search...",
    isLoading,
    emptyMessage = "No data found",
    className,
}: DataGridProps<T>) {

    const handleSort = (key: string) => {
        if (onSort) {
            onSort(key)
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search Bar */}
            {onSearch && (
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            className="pl-9 bg-card"
                            onChange={(e) => onSearch(e.target.value)}
                            aria-label={searchPlaceholder}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={cn(col.className, "whitespace-nowrap")}
                                >
                                    {col.sortable && onSort ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3 h-8 data-[state=open]:bg-accent"
                                            onClick={() => handleSort(col.key)}
                                        >
                                            <span>{col.header}</span>
                                            {sortColumn === col.key ? (
                                                sortDirection === 'desc' ? (
                                                    <ChevronDown className="ml-2 h-3 w-3" />
                                                ) : (
                                                    <ChevronUp className="ml-2 h-3 w-3" />
                                                )
                                            ) : (
                                                <ChevronsUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />
                                            )}
                                        </Button>
                                    ) : (
                                        <span className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                                            {col.header}
                                        </span>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading Skeleton Rows
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            <div className="h-5 w-full animate-pulse rounded bg-muted/50" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length > 0 ? (
                            data.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-muted/30">
                                    {columns.map((col) => (
                                        <TableCell key={`${row.id}-${col.key}`} className={col.className}>
                                            {col.cell ? col.cell(row) : (row as any)[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
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
