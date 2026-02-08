'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Eye,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { formatPrice } from '@/lib/utils/formatting'

import { type Order } from '@/lib/types/database'

// Start of Selection
interface ExtendedOrder extends Omit<Order, 'listing'> {
  is_seller: boolean
  listing: {
    title: string
  } | null
}

interface UserOrdersViewProps {
  initialOrders: ExtendedOrder[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function UserOrdersView({ initialOrders = [] }: UserOrdersViewProps) {
  const { t, locale } = useTranslation(['common', 'dashboard'])
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter orders based on tab and search
  const filteredOrders = useMemo(() => {
    let result = initialOrders

    // Tab Filter (Buying vs Selling)
    if (activeTab === 'buying') {
      result = result.filter((order) => !order.is_seller)
    } else if (activeTab === 'selling') {
      result = result.filter((order) => order.is_seller)
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (o) =>
          o.listing?.title?.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      )
    }

    return result
  }, [initialOrders, activeTab, searchQuery])

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(start, start + itemsPerPage)
  }, [filteredOrders, currentPage])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            {t('dashboard:orders')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:manageTransactions')}
          </p>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        variants={item}
        className="bg-card border-border/60 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 shadow-sm lg:flex-row lg:items-center"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full lg:w-auto"
        >
          <TabsList className="bg-muted/50 border-border/20 h-auto flex-wrap justify-start rounded-lg border p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background data-[state=active]:text-primary h-auto rounded px-4 py-2 text-[9px] font-bold tracking-widest uppercase"
            >
              {t('dashboard:allOrders')}
            </TabsTrigger>
            <TabsTrigger
              value="buying"
              className="data-[state=active]:bg-background data-[state=active]:text-primary h-auto rounded px-4 py-2 text-[9px] font-bold tracking-widest uppercase"
            >
              {t('dashboard:purchases')}
            </TabsTrigger>
            <TabsTrigger
              value="selling"
              className="data-[state=active]:bg-background data-[state=active]:text-primary h-auto rounded px-4 py-2 text-[9px] font-bold tracking-widest uppercase"
            >
              {t('dashboard:sales')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full gap-2 lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="text-muted-foreground/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('common:search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border/60 focus:ring-primary/20 h-10 rounded-lg pl-9"
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={item}
        className="border-border/60 bg-card overflow-hidden rounded-lg border text-left shadow-sm"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20 border-border/40 border-b">
                <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('dashboard:order')}
                </TableHead>
                <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('dashboard:amount')}
                </TableHead>
                <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('dashboard:status')}
                </TableHead>
                <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('dashboard:type')}
                </TableHead>
                <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('common:date')}
                </TableHead>
                <TableHead className="h-10 px-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-accent/40 border-border/40 group border-b transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="max-w-[200px] truncate text-sm font-bold">
                          {order.listing?.title ||
                            t('dashboard:unknownListing')}
                        </p>
                        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                          #{order.id.split('-')[0]}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="font-heading text-base font-bold tracking-tight whitespace-nowrap">
                        {formatPrice(order.amount, order.currency)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant={
                          order.status === 'completed' ? 'success' : 'outline'
                        }
                        className={cn(
                          'rounded-sm px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase shadow-sm',
                          order.status === 'completed'
                            ? 'bg-success/10 text-success border-success/20'
                            : order.status === 'cancelled'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                        )}
                      >
                        {t(`dashboard:orderStatuses.${order.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.is_seller ? (
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-primary border-primary/20 pl-1 text-[8px] font-bold tracking-widest uppercase"
                          >
                            <ArrowUpRight className="mr-1 h-3 w-3" />{' '}
                            {t('dashboard:selling')}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/20 bg-emerald-500/5 pl-1 text-[8px] font-bold tracking-widest text-emerald-600 uppercase"
                          >
                            <ArrowDownLeft className="mr-1 h-3 w-3" />{' '}
                            {t('dashboard:buying')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        asChild
                      >
                        <Link href={`/${locale}/dashboard/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="text-muted-foreground flex flex-col items-center justify-center">
                      <ShoppingBag className="mb-3 h-10 w-10 opacity-20" />
                      <p className="text-sm font-medium">
                        {t('dashboard:noOrders')}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </motion.div>
  )
}
