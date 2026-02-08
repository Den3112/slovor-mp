'use client'

import { ShoppingBag, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Order {
    id: string
    status: 'pending' | 'completed' | 'cancelled' | 'active'
    title: string
    price: string
    date: string
}

interface ActiveOrdersWidgetProps {
    orders: Order[]
}

export function ActiveOrdersWidget({ orders }: ActiveOrdersWidgetProps) {
    const { t, locale } = useTranslation(['dashboard', 'common'])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            case 'cancelled': return <XCircle className="h-4 w-4 text-rose-500" />
            default: return <Clock className="h-4 w-4 text-amber-500" />
        }
    }

    return (
        <HubWidget
            title={t('dashboard:ordersAndSales')}
            icon={ShoppingBag}
            colSpan={4}
            rowSpan={2}
            noPadding
            action={{
                label: t('common:viewAll'),
                icon: ArrowRight,
                onClick: () => window.location.href = `/${locale}/dashboard/orders`,
            }}
        >
            <div className="divide-y divide-border/40">
                {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted/10 p-2 rounded-lg border border-border/20">
                                {getStatusIcon(order.status)}
                            </div>
                            <div className="space-y-0.5">
                                <Link
                                    href={`/${locale}/dashboard/orders/${order.id}`}
                                    className="text-sm font-bold text-foreground hover:text-primary transition-colors block max-w-[150px] truncate"
                                >
                                    {order.title}
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                                        {order.date}
                                    </span>
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 uppercase border-border/40">
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-heading font-bold text-sm block">
                                {order.price}
                            </span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">
                                #{order.id.slice(0, 6)}
                            </span>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/20 mb-3" />
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">
                            {t('dashboard:noOrders')}
                        </p>
                    </div>
                )}
            </div>
        </HubWidget>
    )
}
