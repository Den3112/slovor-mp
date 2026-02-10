'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Package,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/formatting'
import { ordersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Order, User } from '@/lib/types/database'
import { useMounted } from '@/lib/hooks/use-mounted'

interface OrderWithDetails extends Order {
  listing?: any
  seller?: User
  buyer?: User
}

interface OrderDetailsViewProps {
  order: OrderWithDetails
  isAdmin?: boolean
}

export function OrderDetailsView({
  order: initialOrder,
  isAdmin = false,
}: OrderDetailsViewProps) {
  const { t, locale } = useTranslation(['common', 'dashboard', 'admin'])
  const [order, setOrder] = useState<OrderWithDetails>(initialOrder)
  const [isUpdating, setIsUpdating] = useState(false)
  const isMounted = useMounted()

  const handleUpdateStatus = async (status: 'completed' | 'cancelled') => {
    setIsUpdating(true)
    try {
      const { error } = await ordersApi.updateStatus(supabase, order.id, status)
      if (error) throw new Error(error.message)

      toast.success(t('admin:orderStatusUpdated') || 'Order status updated')
      setOrder({ ...order, status })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const backPath = isAdmin
    ? `/${locale}/admin/orders`
    : `/${locale}/dashboard/orders`

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    completed: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    refunded: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="bg-muted/50 hover:bg-muted rounded-full"
          >
            <Link href={backPath}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight uppercase">
              {t('dashboard:orderDetail') || 'Order Details'}
              <Badge
                className={cn(
                  'rounded-sm border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-sm',
                  statusColors[order.status as keyof typeof statusColors]
                )}
              >
                {order.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
              ID: <span className="text-foreground">#{order.id}</span>
              •
              <Calendar className="h-3 w-3" />
              {isMounted ? new Date(order.created_at).toLocaleString() : '...'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border/60 h-10 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
          >
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          {isAdmin && order.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="default"
                className="bg-success hover:bg-success/90 h-10 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
                onClick={() => handleUpdateStatus('completed')}
                disabled={isUpdating}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Completed
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-10 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={isUpdating}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Product & Payment */}
        <div className="space-y-8 lg:col-span-2">
          {/* Item Details */}
          <Card className="border-border/60 overflow-hidden rounded-2xl shadow-sm">
            <CardHeader className="bg-muted/20 border-border/40 text-muted-foreground border-b px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase">
              Item Details
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="bg-muted border-border/10 relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border">
                  {order.listing?.images?.[0] ? (
                    <Image
                      src={order.listing.images[0]}
                      alt={order.listing.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Package className="text-muted-foreground/20 m-auto h-12 w-12" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {order.listing?.title}
                    </h3>
                    <p className="text-muted-foreground/60 mt-1 text-xs font-bold tracking-widest uppercase">
                      Listing ID: #{order.listing_id}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-1">
                      <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                        Unit Price
                      </p>
                      <p className="text-lg font-bold tracking-tight">
                        {formatPrice(order.amount, order.currency)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                        Quantity
                      </p>
                      <p className="text-lg font-bold tracking-tight">1</p>
                    </div>
                    <div className="ml-auto space-y-1 text-right">
                      <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                        Total
                      </p>
                      <p className="text-primary text-2xl font-bold tracking-tighter">
                        {formatPrice(order.amount, order.currency)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-border/60 mt-2 h-8 rounded-lg text-[9px] font-bold tracking-widest uppercase"
                  >
                    <Link href={`/${locale}/listings/${order.listing_id}`}>
                      View Listing{' '}
                      <ArrowLeft className="ml-2 h-3 w-3 rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card className="border-border/60 overflow-hidden rounded-2xl shadow-sm">
            <CardHeader className="bg-muted/20 border-border/40 flex flex-row items-center justify-between space-y-0 border-b px-6 py-4">
              <CardTitle className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
                Payment Information
              </CardTitle>
              <ShieldCheck className="text-primary h-4 w-4" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="space-y-1.5">
                  <dt className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                    Payment Method
                  </dt>
                  <dd className="flex items-center gap-2 text-sm font-bold">
                    <Wallet className="text-primary h-4 w-4" />
                    {order.payment_method}
                  </dd>
                </div>
                <div className="space-y-1.5">
                  <dt className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                    Currency
                  </dt>
                  <dd className="text-sm font-bold uppercase">
                    {order.currency}
                  </dd>
                </div>
                <div className="space-y-1.5">
                  <dt className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                    Security Status
                  </dt>
                  <dd className="text-success text-sm font-bold">
                    Verified Secure
                  </dd>
                </div>
                <div className="space-y-1.5">
                  <dt className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                    Platform Fee
                  </dt>
                  <dd className="text-sm font-bold">0.00 {order.currency}</dd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Buyer/Seller Info */}
        <div className="space-y-8">
          {/* User Cards */}
          <Card className="border-border/60 bg-card overflow-hidden rounded-2xl shadow-sm">
            <CardHeader className="bg-muted/20 border-border/40 text-muted-foreground border-b px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase">
              Participants
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Seller */}
              <div className="space-y-3">
                <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                  Seller
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border">
                    <UserIcon className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {order.seller?.full_name || 'Anonymous User'}
                    </p>
                    <p className="text-muted-foreground truncate text-[10px] font-bold">
                      @{order.seller?.id.split('-')[0]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    asChild
                  >
                    <Link href={`/${locale}/seller/${order.seller_id}`}>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="bg-border/40 h-px" />

              {/* Buyer */}
              <div className="space-y-3">
                <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                  Buyer
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {order.buyer?.full_name || 'Anonymous User'}
                    </p>
                    <p className="text-muted-foreground truncate text-[10px] font-bold">
                      @{order.buyer?.id.split('-')[0]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    asChild
                  >
                    <Link href={`/${locale}/seller/${order.buyer_id}`}>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support & Help */}
          <Card className="selection:bg-primary/30 overflow-hidden rounded-2xl border-none bg-slate-950 text-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-white/5 bg-white/5 px-6 py-4">
              <CardTitle className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                Support Center
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <p className="text-[11px] leading-relaxed font-bold tracking-widest text-white/60 uppercase">
                Need help with this order or want to report a problem?
              </p>
              <Button className="h-12 w-full rounded-lg border border-white/10 bg-white/5 text-[9px] font-bold tracking-widest text-white uppercase hover:bg-white/10">
                Contact Resolution Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
