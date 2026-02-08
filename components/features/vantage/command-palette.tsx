'use client'

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Command,
  LayoutDashboard,
  ShieldCheck,
  Package,
  Users,
  MessageCircle,
  Bell,
  Settings,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useVantage } from '@/components/providers/vantage-provider'
import { cn } from '@/lib/utils'
import { profilesApi, listingsApi } from '@/lib/api'
import type { User, Listing } from '@/lib/types/database'
import { Loader2 } from 'lucide-react'

export function GlobalCommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useVantage()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    users: User[]
    listings: Listing[]
  }>({ users: [], listings: [] })

  const router = useRouter()
  const { t } = useTranslation(['common', 'admin', 'dashboard'])

  const items = useMemo(
    () => [
      // Admin Actions
      {
        id: 'admin-dashboard',
        label: t('admin:dashboard'),
        icon: LayoutDashboard,
        href: '/admin',
        group: 'Admin',
      },
      {
        id: 'admin-moderation',
        label: t('admin:moderation'),
        icon: ShieldCheck,
        href: '/admin/listings',
        group: 'Admin',
      },
      {
        id: 'admin-users',
        label: t('admin:users'),
        icon: Users,
        href: '/admin/users',
        group: 'Admin',
      },
      // User Actions
      {
        id: 'user-dashboard',
        label: t('common:dashboard'),
        icon: LayoutDashboard,
        href: '/dashboard',
        group: 'User',
      },
      {
        id: 'user-listings',
        label: t('dashboard:myListings'),
        icon: Package,
        href: '/dashboard/listings',
        group: 'User',
      },
      {
        id: 'user-messages',
        label: t('dashboard:messages'),
        icon: MessageCircle,
        href: '/dashboard/messages',
        group: 'User',
      },
      {
        id: 'user-notifications',
        label: t('common:notifications'),
        icon: Bell,
        href: '/dashboard/notifications',
        group: 'User',
      },
      {
        id: 'user-settings',
        label: t('dashboard:settings'),
        icon: Settings,
        href: '/dashboard/settings',
        group: 'User',
      },
    ],
    [t]
  )

  const filteredItems = useMemo(() => {
    if (!query) return items
    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  // Combined searchable results
  const allResults = useMemo(() => {
    const results = [...filteredItems]

    // Add User Results
    searchResults.users.forEach(user => {
      results.push({
        id: `user-${user.id}`,
        label: user.display_name || user.username || 'User',
        icon: Users,
        href: `/admin/users?id=${user.id}`,
        group: 'Global Search: Users'
      } as any)
    })

    // Add Listing Results
    searchResults.listings.forEach(listing => {
      results.push({
        id: `listing-${listing.id}`,
        label: listing.title,
        icon: Package,
        href: `/listings/${listing.id}`,
        group: 'Global Search: Listings'
      } as any)
    })

    return results
  }, [filteredItems, searchResults])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Debounced search logic
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults({ users: [], listings: [] })
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const [usersRes, listingsRes] = await Promise.all([
          profilesApi.getAdminAll(), // For now, simple search. In real case we would have searchByName
          listingsApi.getAll({ search: query, limit: 5 })
        ])

        // Mock search for users as we don't have dedicated search endpoint yet
        const matchedUsers = (usersRes.data || [])
          .filter(u =>
            u.display_name?.toLowerCase().includes(query.toLowerCase()) ||
            u.username?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)

        setSearchResults({
          users: matchedUsers,
          listings: listingsRes.data || []
        })
      } catch (error) {
        console.error('Command Palette Search Error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('')
    }
  }, [isCommandPaletteOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % allResults.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(
          (prev) => (prev - 1 + allResults.length) % allResults.length
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = allResults[activeIndex]
        if (selected) {
          router.push(selected.href)
          setCommandPaletteOpen(false)
        }
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isCommandPaletteOpen,
    filteredItems,
    activeIndex,
    router,
    allResults,
    setCommandPaletteOpen,
  ])

  if (!isCommandPaletteOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCommandPaletteOpen(false)}
        className="bg-background/80 fixed inset-0 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border-border/50 relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl"
      >
        <div className="border-border/10 flex items-center border-b px-4 py-3">
          {isSearching ? (
            <Loader2 className="text-primary mr-3 h-5 w-5 animate-spin" />
          ) : (
            <Search className="text-muted-foreground mr-3 h-5 w-5" />
          )}
          <input
            autoFocus
            className="text-foreground placeholder:text-muted-foreground/50 w-full bg-transparent text-lg focus:outline-hidden"
            placeholder={t('common:searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <kbd className="bg-muted text-muted-foreground hidden items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] md:flex">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
        </div>

        <div className="scrollbar-hide max-h-[60vh] overflow-y-auto p-2">
          {allResults.length > 0 ? (
            <div className="space-y-4">
              {['Admin', 'User', 'Global Search: Users', 'Global Search: Listings'].map((group) => {
                const groupItems = allResults.filter(
                  (i) => i.group === group
                )
                if (groupItems.length === 0) return null

                return (
                  <div key={group} className="space-y-1">
                    <div className="text-muted-foreground/60 px-3 py-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {group}
                    </div>
                    {groupItems.map((item) => {
                      const globalIndex = allResults.findIndex(
                        (fi) => fi.id === item.id
                      )
                      const isActive = globalIndex === activeIndex
                      const Icon = item.icon

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            router.push(item.href)
                            setCommandPaletteOpen(false)
                          }}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          className={cn(
                            'group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-primary/20 scale-[1.02] shadow-lg'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                              isActive
                                ? 'bg-white/20'
                                : 'bg-muted group-hover:bg-background'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="flex-1 font-medium">
                            {item.label}
                          </span>
                          {isActive && (
                            <motion.div layoutId="arrow">
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          )}
                          {!isActive && (
                            <Zap className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Command className="text-muted-foreground/50 h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No commands found for &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>

        <div className="bg-muted/50 border-border/10 flex items-center justify-between border-t px-4 py-3 text-[10px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="bg-background rounded border px-1.5 py-0.5">
                ↵
              </kbd>
              <span className="text-muted-foreground tracking-wider uppercase">
                Select
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="bg-background rounded border px-1.5 py-0.5">
                ↑↓
              </kbd>
              <span className="text-muted-foreground tracking-wider uppercase">
                Navigate
              </span>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <Zap className="text-primary h-3 w-3" />
            VANTAGE v3
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
