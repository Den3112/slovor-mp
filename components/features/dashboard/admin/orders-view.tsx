'use client'

import { useState } from 'react'
import { Eye, Calendar, User, CheckCircle2, XCircle, Package } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataGrid } from '@/components/features/dashboard/shared/data-grid'
import { formatPrice } from '@/lib/utils/formatting'
import { ordersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminOrdersViewProps {
    initialOrders: any[]
}

export function AdminOrdersView({ initialOrders = [] }: AdminOrdersViewProps) {
    const { t, locale } = useTranslation(['common', 'admin'])
    const [orders, setOrders] = useState(initialOrders)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.seller?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleUpdateStatus = async (id: string, status: 'completed' | 'cancelled') => {
        try {
            const { error } = await ordersApi.updateStatus(supabase, id, status)
            if (error) throw new Error(error.message)

            toast.success(t('admin:orderStatusUpdated') || 'Order status updated')
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const columns = [
        {
            key: 'id',
            header: 'Order ID',
            cell: (row: any) => (
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    #{row.id.split('-')[0]}
                </span>
            )
        },
        {
            key: 'listing',
            header: 'Listing',
            cell: (row: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm truncate max-w-[150px]">{row.listing?.title || 'Unknown'}</span>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">ID: #{row.listing_id.split('-')[0]}</span>
                </div>
            )
        },
        {
            key: 'buyer',
            header: 'Buyer',
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground/40" />
                    <span className="font-bold text-xs">{row.buyer?.full_name || 'System'}</span>
                </div>
            )
        },
        {
            key: 'seller',
            header: 'Seller',
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground/40" />
                    <span className="font-bold text-xs">{row.seller?.full_name || 'System'}</span>
                </div>
            )
        },
        {
            key: 'amount',
            header: 'Amount',
            cell: (row: any) => (
                <span className="font-bold text-sm tracking-tight text-primary">
                    {formatPrice(row.amount, row.currency)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row: any) => {
                const statusStyles = {
                    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dot-amber-500",
                    completed: "bg-success/10 text-success border-success/20 dot-success",
                    cancelled: "bg-destructive/10 text-destructive border-destructive/20 dot-destructive",
                    refunded: "bg-blue-500/10 text-blue-600 border-blue-500/20 dot-blue-500"
                }
                const dotStyles = {
                    pending: "bg-amber-500",
                    completed: "bg-success",
                    cancelled: "bg-destructive",
                    refunded: "bg-blue-500"
                }

                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-2.5 py-0.5 border font-bold text-[9px] uppercase tracking-widest rounded-md gap-1.5 flex items-center w-fit h-6",
                            statusStyles[row.status as keyof typeof statusStyles] || "bg-muted text-muted-foreground border-border/40"
                        )}
                    >
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotStyles[row.status as keyof typeof dotStyles] || "bg-muted-foreground/40")} />
                        {row.status}
                    </Badge>
                )
            }
        },
        {
            key: 'created_at',
            header: 'Date',
            cell: (row: any) => (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Calendar className="h-3 w-3" />
                    {new Date(row.created_at).toLocaleDateString()}
                </div>
            )
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            cell: (row: any) => (
                <div className="flex justify-end gap-2">
                    {row.status === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-lg border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-600"
                                onClick={() => handleUpdateStatus(row.id, 'completed')}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-lg border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
                                onClick={() => handleUpdateStatus(row.id, 'cancelled')}
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-background hover:bg-muted" asChild>
                        <Link href={`/${locale}/admin/orders/${row.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase flex items-center gap-3">
                        <Package className="h-8 w-8 text-primary" />
                        {t('admin:marketplaceTransactions') || 'Marketplace Transactions'}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="p-1 rounded-sm bg-primary/10 text-primary">Live Data</span>
                        {t('admin:manageAllOrders')}
                    </p>
                </div>
            </div>

            <DataGrid
                columns={columns}
                data={filteredOrders}
                onSearch={setSearchQuery}
                searchPlaceholder={t('admin:searchOrders')}
                emptyMessage="No platform transactions found."
            />
        </div>
    )
}
