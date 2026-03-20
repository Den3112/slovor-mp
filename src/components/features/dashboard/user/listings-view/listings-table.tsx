'use client'

import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { ListingsRow } from './listings-row'
import { ListingsEmpty } from './listings-empty'
import { Listing } from './types'
import { useTranslation } from '@/lib/i18n'

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

interface ListingsTableProps {
  listings: Listing[]
  paginatedListings: Listing[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  locale: string
}

export function ListingsTable({
  listings,
  paginatedListings,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  locale,
}: ListingsTableProps) {
  const { t } = useTranslation(['common', 'dashboard', 'createListing'])

  return (
    <div className="space-y-6">
      <motion.div variants={item} className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/5 hover:bg-transparent">
                <TableHead className="w-12 px-6 py-5 text-center">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        selectedIds.length === listings.length &&
                        listings.length > 0
                      }
                      onCheckedChange={onToggleSelectAll}
                      className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-md transition-all duration-300"
                    />
                  </div>
                </TableHead>
                <TableHead className="text-primary/40 h-auto px-6 py-5 text-[10px] font-black tracking-[0.25em] uppercase">
                  {t('common:title')}
                </TableHead>
                <TableHead className="text-primary/40 h-auto px-6 py-5 text-[10px] font-black tracking-[0.25em] uppercase">
                  {t('createListing:price')}
                </TableHead>
                <TableHead className="text-primary/40 h-auto px-6 py-5 text-[10px] font-black tracking-[0.25em] uppercase">
                  {t('dashboard:status')}
                </TableHead>
                <TableHead className="text-primary/40 h-auto px-6 py-5 text-[10px] font-black tracking-[0.25em] uppercase">
                  {t('dashboard:stats')}
                </TableHead>
                <TableHead className="h-auto px-6 py-5 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-primary/5 border-t">
              {paginatedListings.length > 0 ? (
                paginatedListings.map((listing) => (
                  <ListingsRow
                    key={listing.id}
                    listing={listing}
                    selected={selectedIds.includes(listing.id)}
                    onToggle={() => onToggleSelect(listing.id)}
                    locale={locale}
                  />
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="p-0">
                    <ListingsEmpty />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={listings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
