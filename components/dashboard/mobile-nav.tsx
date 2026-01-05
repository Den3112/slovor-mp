'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, List, Heart, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Listings', href: '/dashboard/listings', icon: List },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardMobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 lg:hidden">
      <nav className="no-scrollbar flex items-center justify-between overflow-x-auto rounded-[2rem] border border-border/10 bg-background/90 p-2 shadow-2xl backdrop-blur-xl">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative flex min-w-[4rem] flex-1 flex-col items-center justify-center gap-1 rounded-[1.5rem] py-3 transition-all',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-mobile-tab"
                  className="absolute inset-0 rounded-[1.5rem] bg-muted/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
