'use client'

// Pagination Component
// Principle #1: Small, focused component

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange?: (page: number) => void
  itemsPerPage?: number
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage = 50,
}: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return

    if (onPageChange) {
      onPageChange(page)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`?${params.toString()}`)
    }
  }

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="border-border bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm">
      <div className="text-muted-foreground text-sm">
        Showing{' '}
        <span className="text-foreground font-semibold">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{' '}
        to{' '}
        <span className="text-foreground font-semibold">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{' '}
        of <span className="text-foreground font-semibold">{totalItems}</span>{' '}
        results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-border hover:bg-accent rounded-xl border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => goToPage(page)}
              className={`rounded-xl px-4 py-2 font-medium transition-colors ${currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-accent border'
                }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="text-muted-foreground px-2">
              {page}
            </span>
          )
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-border hover:bg-accent rounded-xl border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
