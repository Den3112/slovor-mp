'use client'

import {
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-rose-500" />
      default:
        return <Clock className="h-4 w-4 text-amber-500" />
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
        onClick: () => router.push(`/${locale}/dashboard/orders`),
      }}
    >
      <div className="divide-border/40 divide-y">
        {orders.slice(0, 3).map((order) => (
          <div
            key={order.id}
            className="hover:bg-muted/5 group flex items-center justify-between p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-muted/10 border-border/20 rounded-xl border p-2">
                {getStatusIcon(order.status)}
              </div>
              <div className="space-y-0.5">
                <Link
                  href={`/${locale}/dashboard/orders/${order.id}`}
                  className="text-foreground hover:text-primary block max-w-[150px] truncate text-sm font-bold transition-colors"
                >
                  {order.title}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                    {order.date}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-border/40 h-4 px-1 py-0 text-[9px] uppercase"
                  >
                    {t(`dashboard:orderStatuses.${order.status}`)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-heading block text-sm font-bold">
                {order.price}
              </span>
              <span className="text-muted-foreground text-[9px] tracking-widest uppercase">
                #{order.id.slice(0, 6)}
              </span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="text-muted-foreground/20 mb-3 h-8 w-8" />
            <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              {t('dashboard:noOrders')}
            </p>
          </div>
        )}
      </div>
    </HubWidget>
  )
}
