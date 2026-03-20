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
        className="bg-muted border-border/60 flex flex-col items-start justify-between gap-4 rounded-2xl border p-2 lg:flex-row lg:items-center"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full lg:w-auto"
        >
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:border-border/50 h-auto rounded-xl border border-transparent px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
            >
              {t('dashboard:allOrders')}
            </TabsTrigger>
            <TabsTrigger
              value="buying"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:border-border/50 h-auto rounded-xl border border-transparent px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
            >
              {t('dashboard:purchases')}
            </TabsTrigger>
            <TabsTrigger
              value="selling"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:border-border/50 h-auto rounded-xl border border-transparent px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
            >
              {t('dashboard:sales')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full gap-2 px-2 lg:w-auto lg:px-0">
          <div className="relative flex-1 lg:w-72">
            <Search className="text-muted-foreground/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('common:search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border/60 focus:ring-primary/20 bg-background/50 h-10 rounded-xl pl-10 shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Orders List (Mobile & Desktop) */}
      <motion.div variants={item} className="space-y-4">
        {/* Mobile View (Cards) */}
        <div className="space-y-4 md:hidden">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border-border/60 space-y-3 rounded-xl border p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-60">
                        #{order.id.split('-')[0]}
                      </span>
                      <span className="text-muted-foreground/40 text-[10px] font-bold">
                        •
                      </span>
                      <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold tracking-tight">
                      {order.listing?.title || t('dashboard:unknownListing')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      order.status === 'completed' ? 'success' : 'outline'
                    }
                    className={cn(
                      'shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase shadow-sm',
                      order.status === 'completed'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                        : order.status === 'cancelled'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {t(`dashboard:orderStatuses.${order.status}`)}
                  </Badge>
                </div>

                <div className="border-border/40 flex items-center justify-between border-t pt-3">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
                      {t('dashboard:amount')}
                    </span>
                    <span className="font-heading text-primary/90 text-base font-bold tracking-tight">
                      {formatPrice(order.amount, order.currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.is_seller ? (
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 py-0.5 pr-2 pl-1.5 text-[9px] font-bold tracking-widest uppercase"
                      >
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        {t('dashboard:selling')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-blue-500/20 bg-blue-500/5 py-0.5 pr-2 pl-1.5 text-[9px] font-bold tracking-widest text-blue-600 uppercase"
                      >
                        <ArrowDownLeft className="mr-1 h-3 w-3" />
                        {t('dashboard:buying')}
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary ml-1 h-8 w-8 rounded-xl"
                      asChild
                    >
                      <Link href={`/${locale}/dashboard/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-muted/20 border-border/60 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <div className="bg-muted/50 mb-3 rounded-full p-4">
                <ShoppingBag className="h-6 w-6 opacity-30" />
              </div>
              <p className="text-xs font-medium tracking-wide uppercase opacity-50">
                {t('dashboard:noOrders')}
              </p>
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="border-border/60 bg-card hidden overflow-hidden rounded-2xl border text-left shadow-sm md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-border/40 hover:bg-muted/30 border-b">
                  <TableHead className="text-muted-foreground/60 h-12 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('dashboard:order')}
                  </TableHead>
                  <TableHead className="text-muted-foreground/60 h-12 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('dashboard:amount')}
                  </TableHead>
                  <TableHead className="text-muted-foreground/60 h-12 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('dashboard:status')}
                  </TableHead>
                  <TableHead className="text-muted-foreground/60 h-12 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('dashboard:type')}
                  </TableHead>
                  <TableHead className="text-muted-foreground/60 h-12 px-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('common:date')}
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-accent/40 border-border/40 group border-b transition-colors"
                    >
                      <TableCell className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="max-w-[200px] truncate text-sm font-bold tracking-tight">
                            {order.listing?.title ||
                              t('dashboard:unknownListing')}
                          </p>
                          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-60">
                            #{order.id.split('-')[0]}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="font-heading text-primary/90 text-base font-bold tracking-tight whitespace-nowrap tabular-nums">
                          {formatPrice(order.amount, order.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge
                          variant={
                            order.status === 'completed' ? 'success' : 'outline'
                          }
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase shadow-sm',
                            order.status === 'completed'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                              : order.status === 'cancelled'
                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                : 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                          )}
                        >
                          {t(`dashboard:orderStatuses.${order.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {order.is_seller ? (
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 py-1 pr-2.5 pl-1.5 text-[9px] font-bold tracking-widest uppercase transition-colors"
                            >
                              <ArrowUpRight className="mr-1.5 h-3 w-3" />{' '}
                              {t('dashboard:selling')}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-blue-500/20 bg-blue-500/5 py-1 pr-2.5 pl-1.5 text-[9px] font-bold tracking-widest text-blue-600 uppercase transition-colors hover:bg-blue-500/10"
                            >
                              <ArrowDownLeft className="mr-1.5 h-3 w-3" />{' '}
                              {t('dashboard:buying')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary h-9 w-9 rounded-xl transition-all"
                          asChild
                        >
                          <Link
                            href={`/${locale}/dashboard/orders/${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-4">
                        <div className="bg-muted/50 rounded-full p-4">
                          <ShoppingBag className="h-8 w-8 opacity-30" />
                        </div>
                        <p className="text-sm font-medium tracking-wide uppercase opacity-50">
                          {t('dashboard:noOrders')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
