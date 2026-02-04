'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Eye, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
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

interface UserOrdersViewProps {
    initialOrders: any[]
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export function UserOrdersView({ initialOrders = [] }: UserOrdersViewProps) {
    const { t } = useTranslation(['common', 'dashboard'])
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filter orders based on tab and search
    const filteredOrders = useMemo(() => {
        let result = initialOrders

        // Tab Filter (Buying vs Selling)
        if (activeTab === 'buying') {
            // In a real app we'd compare with user.id
            // For now let's assume filtering is done by API or we have types
        } else if (activeTab === 'selling') {
            // same here
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(o =>
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
            <motion.div variants={item} className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{t('dashboard:orders') || 'Orders'}</h1>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Manage your transactions and purchases</p>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div variants={item} className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-4 rounded-xl border border-border/60 shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                    <TabsList className="bg-muted/50 p-1 rounded-lg h-auto flex-wrap justify-start border border-border/20">
                        <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-primary px-4 py-2 h-auto text-[9px] font-black uppercase tracking-widest">All Orders</TabsTrigger>
                        <TabsTrigger value="buying" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-primary px-4 py-2 h-auto text-[9px] font-black uppercase tracking-widest">Purchases</TabsTrigger>
                        <TabsTrigger value="selling" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-primary px-4 py-2 h-auto text-[9px] font-black uppercase tracking-widest">Sales</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                            placeholder={t('common:search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 border-border/60 focus:ring-primary/20 rounded-xl"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={item} className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/40">
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Order</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Amount</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Status</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Type</TableHead>
                                <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{t('common:date')}</TableHead>
                                <TableHead className="px-6 h-10 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-accent/40 border-b border-border/40 transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-sm truncate max-w-[200px]">{order.listing?.title || 'Unknown Listing'}</p>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">#{order.id.split('-')[0]}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="font-heading text-base font-black tracking-tight whitespace-nowrap">
                                                {formatPrice(order.amount, order.currency)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge
                                                variant={order.status === 'completed' ? 'success' : 'outline'}
                                                className={cn(
                                                    "rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm",
                                                    order.status === 'completed' ? "bg-success/10 text-success border-success/20" :
                                                        order.status === 'cancelled' ? "bg-destructive/10 text-destructive border-destructive/20" :
                                                            "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                )}
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {order.is_seller ? (
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest pl-1">
                                                        <ArrowUpRight className="h-3 w-3 mr-1" /> Selling
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest pl-1">
                                                        <ArrowDownLeft className="h-3 w-3 mr-1" /> Buying
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-muted-foreground/60 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                                                <Link href={`/dashboard/orders/${order.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ShoppingBag className="h-10 w-10 opacity-20 mb-3" />
                                            <p className="text-sm font-medium">No orders found</p>
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
