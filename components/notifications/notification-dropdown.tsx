'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, ExternalLink, Inbox, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '@/lib/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export function NotificationDropdown() {
  const { t, locale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative h-10 w-10 rounded-full hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell
          className={cn(
            'h-5 w-5 transition-transform duration-300 group-hover:scale-110',
            unreadCount > 0
              ? 'text-primary animate-ring'
              : 'text-muted-foreground group-hover:text-foreground'
          )}
        />

        {unreadCount > 0 && (
          <span className="bg-primary ring-background animate-in zoom-in-50 absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="bg-card/95 absolute right-0 z-50 mt-3 w-80 origin-top-right overflow-hidden rounded-2xl border border-white/10 shadow-lg backdrop-blur-2xl md:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  {t('common:notifications') || 'Notifications'}
                </h3>
                <p className="text-muted-foreground text-xs font-medium">
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
                  className="hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-bold tracking-widest uppercase"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* List */}
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-1 p-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 opacity-50">
                    <div className="border-primary border-t-background h-4 w-4 animate-spin rounded-full border-2" />
                    <span className="text-xs font-bold tracking-widest uppercase">
                      Syncing...
                    </span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="bg-muted/50 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                      <Inbox className="text-muted-foreground/50 h-6 w-6" />
                    </div>
                    <p className="text-foreground text-sm font-bold">
                      No notifications yet
                    </p>
                    <p className="text-muted-foreground mt-1 max-w-[200px] text-xs">
                      We&apos;ll notify you when something important happens.
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.is_read && markAsRead(notif.id)}
                      className={cn(
                        'group relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300',
                        notif.is_read
                          ? 'hover:bg-muted/50'
                          : 'bg-primary/5 hover:bg-primary/10 border-primary/10 border'
                      )}
                    >
                      <div className="flex gap-4">
                        {/* Icon/Type Avatar */}
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform group-hover:scale-110',
                            notif.is_read
                              ? 'bg-muted/30 border-white/5'
                              : 'border-primary/20 bg-primary/20'
                          )}
                        >
                          <span className="text-lg">
                            {notif.type === 'message' && (
                              <MessageCircle className="h-4 w-4" />
                            )}
                            {notif.type === 'sold' && '💰'}
                            {notif.type === 'offer' && '🏷️'}
                            {notif.type === 'payment' && '💳'}
                            {notif.type === 'review' && '⭐'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                'mb-1 text-sm leading-none font-bold',
                                notif.is_read
                                  ? 'text-foreground/80'
                                  : 'text-foreground'
                              )}
                            >
                              {notif.title}
                            </p>
                            {!notif.is_read && (
                              <span className="bg-primary h-2 w-2 shrink-0 animate-pulse rounded-full" />
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2 line-clamp-2 text-xs font-medium">
                            {notif.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground/60 text-[10px] font-medium">
                              {formatDistanceToNow(new Date(notif.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                            {notif.link && (
                              <Link
                                href={
                                  notif.link?.startsWith('/')
                                    ? `/${locale}${notif.link}`
                                    : notif.link
                                }
                                className="text-primary flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase hover:underline"
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
            <div className="bg-muted/30 border-t border-white/5 p-3">
              <Link href={`/${locale}/dashboard/notifications`}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground w-full rounded-lg text-xs font-bold"
                >
                  View full history
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes ring {
          0% {
            transform: rotate(0);
          }
          5% {
            transform: rotate(15deg);
          }
          10% {
            transform: rotate(-12deg);
          }
          15% {
            transform: rotate(10deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          25% {
            transform: rotate(6deg);
          }
          30% {
            transform: rotate(-4deg);
          }
          35% {
            transform: rotate(2deg);
          }
          40% {
            transform: rotate(-1deg);
          }
          45% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }
        .animate-ring {
          animation: ring 2.5s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </div>
  )
}
