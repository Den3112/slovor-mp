'use client'

import { useState } from 'react'
import {
  Eye,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react'
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

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.seller?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpdateStatus = async (
    id: string,
    status: 'completed' | 'cancelled'
  ) => {
    try {
      const { error } = await ordersApi.updateStatus(supabase, id, status)
      if (error) throw new Error(error.message)

      toast.success(t('admin:orderStatusUpdated'))
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const columns = [
    {
      key: 'id',
      header: t('admin:orderId'),
      cell: (row: any) => (
        <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          #{row.id.split('-')[0]}
        </span>
      ),
    },
    {
      key: 'listing',
      header: t('admin:tableListing'),
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="max-w-[150px] truncate text-sm font-bold">
            {row.listing?.title || t('admin:unknownListing')}
          </span>
          <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
            ID: #{row.listing_id.split('-')[0]}
          </span>
        </div>
      ),
    },
    {
      key: 'buyer',
      header: t('admin:tableBuyer'),
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground/40 h-3 w-3" />
          <span className="text-xs font-bold">
            {row.buyer?.full_name || t('admin:system')}
          </span>
        </div>
      ),
    },
    {
      key: 'seller',
      header: t('admin:tableSeller'),
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground/40 h-3 w-3" />
          <span className="text-xs font-bold">
            {row.seller?.full_name || t('admin:system')}
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: t('admin:tableAmount'),
      cell: (row: any) => (
        <span className="text-primary text-sm font-bold tracking-tight">
          {formatPrice(row.amount, row.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('admin:tableStatus'),
      cell: (row: any) => {
        const statusStyles = {
          pending:
            'bg-amber-500/10 text-amber-600 border-amber-500/20 dot-amber-500',
          completed: 'bg-success/10 text-success border-success/20 dot-success',
          cancelled:
            'bg-destructive/10 text-destructive border-destructive/20 dot-destructive',
          refunded:
            'bg-blue-500/10 text-blue-600 border-blue-500/20 dot-blue-500',
        }
        const dotStyles = {
          pending: 'bg-amber-500',
          completed: 'bg-success',
          cancelled: 'bg-destructive',
          refunded: 'bg-blue-500',
        }

        return (
          <Badge
            variant="outline"
            className={cn(
              'flex h-6 w-fit items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
              statusStyles[row.status as keyof typeof statusStyles] ||
                'bg-muted text-muted-foreground border-border/40'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                dotStyles[row.status as keyof typeof dotStyles] ||
                  'bg-muted-foreground/40'
              )}
            />
            {t(
              `admin:order${row.status.charAt(0).toUpperCase() + row.status.slice(1)}`
            )}
          </Badge>
        )
      },
    },
    {
      key: 'created_at',
      header: t('admin:tableDate'),
      cell: (row: any) => (
        <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
          <Calendar className="h-3 w-3" />
          {new Date(row.created_at).toLocaleDateString()}
        </div>
      ),
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
                className="border-destructive/20 hover:bg-destructive/5 hover:text-destructive h-8 w-8 rounded-lg"
                onClick={() => handleUpdateStatus(row.id, 'cancelled')}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            className="bg-background hover:bg-muted h-8 w-8 rounded-lg"
            asChild
          >
            <Link href={`/${locale}/admin/orders/${row.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <Package className="text-primary h-8 w-8" />
            {t('admin:marketplaceTransactions')}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className="bg-primary/10 text-primary rounded-sm p-1">
              {t('admin:liveData')}
            </span>
            {t('admin:manageAllOrders')}
          </p>
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={filteredOrders}
        onSearch={setSearchQuery}
        searchPlaceholder={t('admin:searchOrders')}
        emptyMessage={t('admin:noOrders')}
      />
    </div>
  )
}
