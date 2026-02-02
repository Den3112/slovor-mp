'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, ExternalLink, Inbox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '@/lib/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export function NotificationDropdown() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-all duration-300"
                aria-label="Notifications"
            >
                <Bell className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    unreadCount > 0 ? "text-primary animate-ring" : "text-muted-foreground group-hover:text-foreground"
                )} />

                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-background animate-in zoom-in-50 duration-300">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-card/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden origin-top-right"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">{t('common.notifications') || 'Notifications'}</h3>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {unreadCount > 0
                                        ? `You have ${unreadCount} unread messages`
                                        : 'System is up to date'}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-black tracking-widest uppercase hover:bg-primary/10 hover:text-primary rounded-xl"
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>

                        {/* List */}
                        <ScrollArea className="max-h-[400px]">
                            <div className="p-2 space-y-1">
                                {isLoading ? (
                                    <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-50">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-background" />
                                        <span className="text-xs font-bold tracking-widest uppercase">Syncing...</span>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                            <Inbox className="h-6 w-6 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">No notifications yet</p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">We&apos;ll notify you when something important happens.</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                                            className={cn(
                                                "group relative p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden",
                                                notif.is_read
                                                    ? "hover:bg-muted/50"
                                                    : "bg-primary/5 hover:bg-primary/10 border border-primary/10"
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                {/* Icon/Type Avatar */}
                                                <div className={cn(
                                                    "h-10 w-10 shrink-0 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110",
                                                    notif.is_read ? "border-white/5 bg-muted/30" : "border-primary/20 bg-primary/20"
                                                )}>
                                                    <span className="text-lg">
                                                        {notif.type === 'message' && '💬'}
                                                        {notif.type === 'sold' && '💰'}
                                                        {notif.type === 'offer' && '🏷️'}
                                                        {notif.type === 'payment' && '💳'}
                                                        {notif.type === 'review' && '⭐'}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={cn(
                                                            "text-sm font-bold leading-none mb-1",
                                                            notif.is_read ? "text-foreground/80" : "text-foreground"
                                                        )}>
                                                            {notif.title}
                                                        </p>
                                                        {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2 font-medium">
                                                        {notif.content}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-muted-foreground/60 font-medium">
                                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                                        </span>
                                                        {notif.link && (
                                                            <Link
                                                                href={notif.link}
                                                                className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                View <ExternalLink className="h-2.5 w-2.5" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        {/* Footer */}
                        <div className="p-3 bg-muted/30 border-t border-white/5">
                            <Link href="/dashboard/notifications">
                                <Button variant="ghost" className="w-full rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">
                                    View full history
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @keyframes ring {
          0% { transform: rotate(0); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-12deg); }
          15% { transform: rotate(10deg); }
          20% { transform: rotate(-8deg); }
          25% { transform: rotate(6deg); }
          30% { transform: rotate(-4deg); }
          35% { transform: rotate(2deg); }
          40% { transform: rotate(-1deg); }
          45% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
        .animate-ring {
          animation: ring 2.5s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
        </div>
    )
}
