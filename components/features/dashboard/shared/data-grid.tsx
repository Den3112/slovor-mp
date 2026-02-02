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
        <div className={cn("space-y-6", className)}>
            {/* Search Bar / Filters Area */}
            {onSearch && (
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={searchPlaceholder}
                            className="pl-9 bg-card border-border/60 focus-visible:ring-primary/20 h-10 font-bold text-xs uppercase tracking-widest"
                            onChange={(e) => onSearch(e.target.value)}
                            aria-label={searchPlaceholder}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/10 border-b border-border/40">
                        <TableRow className="hover:bg-transparent border-0 h-12">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={cn(col.className, "whitespace-nowrap px-6")}
                                >
                                    {col.sortable && onSort ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3 h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-transparent data-[state=open]:bg-accent transition-colors"
                                            onClick={() => handleSort(col.key)}
                                        >
                                            {col.header}
                                            {sortColumn === col.key ? (
                                                sortDirection === 'desc' ? (
                                                    <ChevronDown className="ml-2 h-3.5 w-3.5 text-primary" />
                                                ) : (
                                                    <ChevronUp className="ml-2 h-3.5 w-3.5 text-primary" />
                                                )
                                            ) : (
                                                <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-20 group-hover:opacity-100" />
                                            )}
                                        </Button>
                                    ) : (
                                        <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
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
                                            <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length > 0 ? (
                            data.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-muted/10 border-border/40 transition-colors">
                                    {columns.map((col) => (
                                        <TableCell key={`${row.id}-${col.key}`} className={cn(col.className, "px-6 py-4 transition-colors")}>
                                            {col.cell ? col.cell(row) : (
                                                <span className="text-sm font-medium tracking-tight">{(row as any)[col.key]}</span>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest"
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
