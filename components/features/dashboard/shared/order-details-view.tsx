'use client'

import { useState } from 'react'
import {
    ArrowLeft,
    Calendar,
    User,
    Package,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Download,
    Wallet
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

interface OrderDetailsViewProps {
    order: any
    isAdmin?: boolean
}

export function OrderDetailsView({ order: initialOrder, isAdmin = false }: OrderDetailsViewProps) {
    const { t } = useTranslation(['common', 'dashboard', 'admin'])
    const [order, setOrder] = useState(initialOrder)
    const [isUpdating, setIsUpdating] = useState(false)

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

    const backPath = isAdmin ? '/admin/orders' : '/dashboard/orders'

    const statusColors = {
        pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        completed: "bg-success/10 text-success border-success/20",
        cancelled: "bg-destructive/10 text-destructive border-destructive/20",
        refunded: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full bg-muted/50 hover:bg-muted">
                        <Link href={backPath}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            {t('dashboard:orderDetail') || 'Order Details'}
                            <Badge className={cn("rounded-lg px-2.5 py-0.5 text-[10px] uppercase font-black tracking-widest border shadow-sm", statusColors[order.status as keyof typeof statusColors])}>
                                {order.status}
                            </Badge>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1 flex items-center gap-2">
                            ID: <span className="text-foreground">#{order.id}</span>
                            •
                            <Calendar className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest rounded-xl border-border/60 h-10 px-6">
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                    </Button>
                    {isAdmin && order.status === 'pending' && (
                        <>
                            <Button
                                size="sm"
                                variant="default"
                                className="bg-success hover:bg-success/90 text-[10px] font-black uppercase tracking-widest rounded-xl h-10 px-6"
                                onClick={() => handleUpdateStatus('completed')}
                                disabled={isUpdating}
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Completed
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="text-[10px] font-black uppercase tracking-widest rounded-xl h-10 px-6"
                                onClick={() => handleUpdateStatus('cancelled')}
                                disabled={isUpdating}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Product & Payment */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Item Details */}
                    <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/20 border-b border-border/40 py-4 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">
                            Item Details
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="h-32 w-32 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/10">
                                    {order.listing?.images?.[0] ? (
                                        <img
                                            src={order.listing.images[0]}
                                            alt={order.listing.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Package className="m-auto h-12 w-12 text-muted-foreground/20" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-black italic tracking-tight">{order.listing?.title}</h3>
                                        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Listing ID: #{order.listing_id}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Unit Price</p>
                                            <p className="text-lg font-black tracking-tight">{formatPrice(order.amount, order.currency)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Quantity</p>
                                            <p className="text-lg font-black tracking-tight">1</p>
                                        </div>
                                        <div className="ml-auto text-right space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Total</p>
                                            <p className="text-2xl font-black tracking-tighter text-primary">{formatPrice(order.amount, order.currency)}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="rounded-lg h-8 text-[9px] font-black uppercase tracking-widest mt-2 border-border/60">
                                        <Link href={`/listings/${order.listing_id}`}>View Listing <ArrowLeft className="h-3 w-3 ml-2 rotate-180" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Details */}
                    <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/20 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Payment Information</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1.5">
                                    <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Payment Method</dt>
                                    <dd className="flex items-center gap-2 font-bold text-sm">
                                        <Wallet className="h-4 w-4 text-primary" />
                                        {order.payment_method}
                                    </dd>
                                </div>
                                <div className="space-y-1.5">
                                    <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Currency</dt>
                                    <dd className="font-bold text-sm uppercase">{order.currency}</dd>
                                </div>
                                <div className="space-y-1.5">
                                    <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Security Status</dt>
                                    <dd className="font-bold text-sm text-success">Verified Secure</dd>
                                </div>
                                <div className="space-y-1.5">
                                    <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Platform Fee</dt>
                                    <dd className="font-bold text-sm">0.00 {order.currency}</dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Buyer/Seller Info */}
                <div className="space-y-8">
                    {/* User Cards */}
                    <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden bg-card">
                        <CardHeader className="bg-muted/20 border-b border-border/40 py-4 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">
                            Participants
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Seller */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Seller</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm truncate">{order.seller?.full_name || 'Anonymous User'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground truncate italic">@{order.seller?.id.split('-')[0]}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                                        <Link href={`/profile/${order.seller_id}`}><ArrowLeft className="h-4 w-4 rotate-180" /></Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="h-px bg-border/40" />

                            {/* Buyer */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Buyer</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                                        <User className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm truncate">{order.buyer?.full_name || 'Anonymous User'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground truncate italic">@{order.buyer?.id.split('-')[0]}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                                        <Link href={`/profile/${order.buyer_id}`}><ArrowLeft className="h-4 w-4 rotate-180" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support & Help */}
                    <Card className="rounded-2xl bg-slate-950 text-white selection:bg-primary/30 border-none shadow-xl overflow-hidden">
                        <CardHeader className="bg-white/5 border-b border-white/5 py-4 px-6 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40">Support Center</CardTitle>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-[11px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">Need help with this order or want to report a problem?</p>
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl h-12 font-black uppercase tracking-widest text-[9px] border border-white/10">
                                Contact Resolution Center
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
