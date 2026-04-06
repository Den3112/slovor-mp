'use client'

import {
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { HubWidget } from '@/features/dashboard/shared/hub-widget'
import { useTranslation } from '@/shared/lib/i18n'
import Link from 'next/link'
import { Badge } from '@/shared/ui/badge'

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
      className="border-border bg-card hover:border-primary/20 overflow-hidden shadow-md transition-all duration-500"
      action={{
        label: t('common:viewAll'),
        icon: ArrowRight,
        onClick: () => router.push(`/${locale}/dashboard/orders`),
      }}
    >
      <div className="divide-primary/5 divide-y">
        {orders.slice(0, 3).map((order) => (
          <div
            key={order.id}
            className="hover:bg-primary/5 group flex items-center justify-between p-5 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/5 border-primary/5 flex h-8 w-8 items-center justify-center rounded-xl border shadow-inner transition-transform duration-500 group-hover:scale-110">
                {getStatusIcon(order.status)}
              </div>
              <div className="space-y-1">
                <Link
                  href={`/${locale}/dashboard/orders/${order.id}`}
                  className="text-foreground hover:text-primary block max-w-[150px] truncate text-[13px] font-black tracking-tight transition-colors"
                >
                  {order.title}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-primary/40 text-[9px] font-black tracking-widest uppercase">
                    {order.date}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/10 bg-primary/5 h-4.5 px-1.5 py-0 text-[8px] font-black tracking-widest uppercase"
                  >
                    {t(`dashboard:orderStatuses.${order.status}`)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-heading text-foreground block text-[13px] font-black tracking-tight">
                {order.price}
              </span>
              <span className="text-primary/30 text-[9px] font-black tracking-widest uppercase">
                #{order.id.slice(0, 6)}
              </span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/5 mb-4 rounded-full p-4">
              <ShoppingBag className="text-primary/20 h-8 w-8" />
            </div>
            <p className="text-primary/40 text-[10px] font-black tracking-[0.2em] uppercase">
              {t('dashboard:noOrders')}
            </p>
          </div>
        )}
      </div>
    </HubWidget>
  )
}
