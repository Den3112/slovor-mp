'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'

/**
 * Pagination Component
 *
 * WHY IT EXISTS:
 * - Navigate through large lists of listings
 * - Improves performance (load only 20-50 items at a time)
 * - Better UX than infinite scroll for browsing
 *
 * HOW IT WORKS:
 * - Uses URL 'page' param for current page
 * - Shows page numbers with ellipsis for large ranges
 * - Prev/Next buttons for easy navigation
 */

interface PaginationProps {
  totalItems: number
  itemsPerPage?: number
}

export function Pagination({ totalItems, itemsPerPage = 20 }: PaginationProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Don't show pagination if only 1 page
  if (totalPages <= 1) {
    return null
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }

    router.push(`${pathname}?${params.toString()}`)

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="mb-8 mt-12 flex items-center justify-center gap-2">
      {/* Previous Button */}
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="sr-only">{t.pagination?.previous || 'Previous'}</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-muted-foreground"
              >
                …
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <Button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              variant={isActive ? 'default' : 'outline'}
              className={
                isActive
                  ? 'h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-2 ring-primary ring-offset-2 hover:bg-primary/90'
                  : 'h-10 w-10 rounded-full border-border/50 bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            >
              {pageNum}
            </Button>
          )
        })}
      </div>

      {/* Next Button */}
      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRightIcon className="h-5 w-5" />
        <span className="sr-only">{t.pagination?.next || 'Next'}</span>
      </Button>
    </div>
  )
}
