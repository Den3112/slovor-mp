'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import { listingsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Sub-components
import { ListingsHeader } from './listings-header'
import { ListingsFilters } from './listings-filters'
import { ListingsTable } from './listings-table'
import { BulkActionsBar, BulkConfirmDialog } from './listings-actions'
import { UserListingsViewProps } from './types'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export function UserListingsView({
  initialListings = [],
}: UserListingsViewProps) {
  const { t, i18n } = useTranslation([
    'common',
    'dashboard',
    'createListing',
    'listings',
  ])
  const locale = i18n.language || 'en'
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmAction, setConfirmAction] = useState<
    'delete' | 'deactivate' | null
  >(null)
  const itemsPerPage = 10

  // Filter listings based on tab and search
  const filteredListings = useMemo(() => {
    let result = initialListings

    if (activeTab !== 'all') {
      if (activeTab === 'draft') {
        result = result.filter(
          (l) => l.status === 'draft' || l.status === 'pending'
        )
      } else if (activeTab === 'archived') {
        result = result.filter(
          (l) => l.status === 'expired' || l.status === 'rejected'
        )
      } else {
        result = result.filter((l) => l.status === activeTab)
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
      )
    }

    return result
  }, [initialListings, activeTab, searchQuery])

  // Paginated listings
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredListings.slice(start, start + itemsPerPage)
  }, [filteredListings, currentPage])

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)

  const toggleSelectAll = () => {
    if (
      selectedIds.length === filteredListings.length &&
      filteredListings.length > 0
    ) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredListings.map((l) => l.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkAction = async () => {
    if (selectedIds.length === 0 || !confirmAction) return

    setIsSubmitting(true)
    try {
      if (confirmAction === 'delete') {
        const { error } = await listingsApi.bulkDelete(selectedIds)
        if (error) throw new Error(error)
        toast.success(t('dashboard:deleted') || 'Listings deleted')
      } else if (confirmAction === 'deactivate') {
        const { error } = await listingsApi.bulkUpdateStatus(
          selectedIds,
          'sold'
        )
        if (error) throw new Error(error)
        toast.success(t('dashboard:updated') || 'Listings deactivated')
      }
      setSelectedIds([])
      router.refresh()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsSubmitting(false)
      setConfirmAction(null)
    }
  }

  const tabs = [
    { value: 'all', label: t('dashboard:all'), count: initialListings.length },
    {
      value: 'active',
      label: t('dashboard:active'),
      count: initialListings.filter((l) => l.status === 'active').length,
    },
    {
      value: 'draft',
      label: t('dashboard:drafts'),
      count: initialListings.filter(
        (l) => l.status === 'draft' || l.status === 'pending'
      ).length,
    },
    {
      value: 'sold',
      label: t('dashboard:sold'),
      count: initialListings.filter((l) => l.status === 'sold').length,
    },
    {
      value: 'archived',
      label: t('dashboard:archived'),
      count: initialListings.filter(
        (l) => l.status === 'expired' || l.status === 'rejected'
      ).length,
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-10"
      data-testid="user-listings-view"
    >
      <ListingsHeader count={initialListings.length} />

      <div className="glass-panel border-primary/10 bg-background/20 shadow-primary/5 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <ListingsFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tabs={tabs}
        />

        <BulkActionsBar
          selectedCount={selectedIds.length}
          onCancel={() => setSelectedIds([])}
          onDeactivate={() => setConfirmAction('deactivate')}
          onDelete={() => setConfirmAction('delete')}
          isSubmitting={isSubmitting}
        />

        <BulkConfirmDialog
          action={confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleBulkAction}
          selectedCount={selectedIds.length}
          isSubmitting={isSubmitting}
        />

        <ListingsTable
          listings={filteredListings}
          paginatedListings={paginatedListings}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          locale={locale}
        />
      </div>
    </motion.div>
  )
}
