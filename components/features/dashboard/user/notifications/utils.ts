import {
  Bell,
  MessageCircle,
  ShoppingBag,
  Star,
  Zap,
  CreditCard,
  LucideIcon,
} from 'lucide-react'

export type NotificationType =
  | 'message'
  | 'sold'
  | 'offer'
  | 'promotion'
  | 'payment'
  | string

interface IconConfig {
  icon: LucideIcon
  color: string
  bg: string
}

export const getNotificationIcon = (type: NotificationType): IconConfig => {
  switch (type) {
    case 'message':
      return {
        icon: MessageCircle,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      }
    case 'sold':
      return {
        icon: ShoppingBag,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      }
    case 'offer':
      return { icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    case 'promotion':
      return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' }
    case 'payment':
      return {
        icon: CreditCard,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
      }
    default:
      return { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' }
  }
}
