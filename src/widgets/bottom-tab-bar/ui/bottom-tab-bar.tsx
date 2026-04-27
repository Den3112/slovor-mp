'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Heart, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'
import { useAuth } from '@/app/providers/auth-provider'
import { useUnreadMessages } from '@/entities/chat/hooks'
import { motion } from 'framer-motion'

export function BottomTabBar() {
  const { t, locale } = useTranslation(['common', 'nav'])
  const { user } = useAuth()
  const pathname = usePathname()
  const unreadCount = useUnreadMessages()

  // Hide on dashboard/admin routes
  const isDashboard =
    pathname?.includes('/admin') ||
    pathname?.includes('/dashboard') ||
    pathname?.endsWith('/post')

  if (isDashboard) {
    return null
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}`
    }
    return pathname?.startsWith(`/${locale}${href}`)
  }

  const tabs = [
    { icon: Home, label: t('nav:home'), href: '/' },
    { icon: Search, label: t('nav:search'), href: '/search' },
    { icon: Plus, label: t('nav:postAd'), href: '/post', primary: true },
    { icon: Heart, label: t('nav:favorites'), href: '/dashboard/favorites' },
    {
      icon: User,
      label: user ? 'Dashboard' : t('common:signIn'),
      href: user ? '/dashboard' : '/login',
    },
  ]

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-6 pb-8 md:hidden print:hidden">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-card/70 pointer-events-auto relative mx-auto flex h-16 max-w-md items-center justify-around rounded-[28px] border border-white/10 px-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={`/${locale}${tab.href}`}
              className={cn(
                'group relative flex flex-1 flex-col items-center justify-center gap-1 transition-all',
                'h-full'
              )}
            >
              <div className="relative flex flex-col items-center justify-center">
                {tab.primary ? (
                  <div className="relative -mt-10 mb-1">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-primary flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_8px_30px_rgba(99,102,241,0.4)]"
                    >
                      <Icon className="h-7 w-7" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center rounded-2xl p-2 transition-all group-active:scale-90">
                    {active && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="bg-primary/10 border-primary/20 absolute inset-0 rounded-[18px] border"
                        transition={{
                          type: 'spring',
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <Icon
                      className={cn(
                        'relative z-10 h-5 w-5 transition-all',
                        active
                          ? 'text-primary scale-110'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    {tab.href === (user ? '/dashboard' : '/login') &&
                      unreadCount > 0 && (
                        <span className="bg-primary ring-card absolute -top-1 -right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-sm ring-2">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                  </div>
                )}

                {!tab.primary && (
                  <span
                    className={cn(
                      'mt-0.5 max-w-[60px] truncate px-1 text-[9px] font-bold transition-all',
                      active
                        ? 'text-primary'
                        : 'text-muted-foreground/60 group-hover:text-foreground opacity-0 group-hover:opacity-100'
                    )}
                  >
                    {tab.label}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </motion.nav>
    </div>
  )
}
