'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { listingsApi } from '@/lib/supabase/queries'
import { formatDate } from '@/lib/utils'
import type { Listing } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'

export default function MyListingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t } = useTranslation() as any
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadListings = useCallback(async () => {
    setIsLoading(true)
    if (!user) return
    const res = await listingsApi.getByUser(user.id)
    if (res.data) {
      setListings(res.data)
    }
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    if (user) {
      loadListings()
    }
  }, [user, loadListings])

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        t.dashboard?.confirmDelete ||
          'Are you sure you want to delete this listing?'
      )
    )
      return

    setDeletingId(id)
    const res = await listingsApi.delete(id)
    if (!res.error) {
      setListings((prev) => prev.filter((l) => l.id !== id))
    } else {
      alert('Failed to delete listing')
    }
    setDeletingId(null)
  }

  const handleToggleStatus = async (listing: Listing) => {
    const newStatus = !listing.is_active
    // Optimistic update
    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id ? { ...l, is_active: newStatus } : l
      )
    )

    const res = await listingsApi.update(listing.id, { is_active: newStatus })
    if (res.error) {
      // Revert on error
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id ? { ...l, is_active: listing.is_active } : l
        )
      )
      alert('Failed to update status')
    }
  }

  const filteredListings = listings.filter(
    (l) =>
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.includes(searchQuery)
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 font-heading text-3xl font-black tracking-tight text-foreground">
            {t.dashboard?.myListings || 'My Listings'}
          </h1>
          <p className="text-muted-foreground">
            {t.dashboard?.manageListings ||
              'Manage your active and archived advertisements.'}
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="rounded-full font-bold shadow-lg shadow-primary/20"
        >
          <Link href="/post">
            <Plus className="mr-2 h-4 w-4" />
            {t.common?.postAd || 'Post New Ad'}
          </Link>
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              t.dashboard?.searchPlaceholder || 'Search your listings...'
            }
            className="h-12 w-full rounded-2xl border border-border/50 bg-muted/20 pl-12 pr-4 font-bold text-foreground outline-none transition-all placeholder:font-medium focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="flex gap-2 text-sm font-bold">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-primary">
            {listings.filter((l) => l.is_active).length} Active
          </div>
          <div className="rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 text-muted-foreground">
            {listings.filter((l) => !l.is_active).length} Inactive
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredListings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[2rem] border border-dashed border-border bg-muted/10 py-20 text-center"
            >
              <p className="mb-4 font-medium text-muted-foreground">
                {t.dashboard?.noListings ||
                  'No listings found matching your search.'}
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </motion.div>
          ) : (
            filteredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className={`group flex flex-col gap-6 rounded-[2rem] border bg-card p-4 transition-all md:flex-row ${
                  listing.is_active
                    ? 'border-border/40 hover:border-primary/20'
                    : 'border-border/40 opacity-75 grayscale-[0.5]'
                }`}
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-muted/20 md:h-32 md:w-48">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-black text-muted-foreground/30">
                      IMG
                    </div>
                  )}
                  {!listing.is_active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                      <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <h3
                          onClick={() => router.push(`/listings/${listing.id}`)}
                          className="line-clamp-1 cursor-pointer text-xl font-bold text-foreground transition-colors group-hover:text-primary"
                        >
                          {listing.title}
                        </h3>
                        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          {listing.category?.name || 'Category'} •{' '}
                          {formatDate(listing.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-black text-foreground">
                          {listing.price} {listing.currency}
                        </span>
                        <span className="flex items-center justify-end gap-1 text-xs font-bold text-muted-foreground">
                          <Eye className="h-3 w-3" /> {listing.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-3 border-t border-dashed border-border/40 pt-4">
                    <Button
                      variant={listing.is_active ? 'ghost' : 'secondary'}
                      size="sm"
                      onClick={() => handleToggleStatus(listing)}
                      className={`h-9 rounded-xl font-bold ${listing.is_active ? 'text-muted-foreground hover:text-foreground' : 'text-foreground'}`}
                    >
                      {listing.is_active ? (
                        <EyeOff className="mr-2 h-4 w-4" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      {listing.is_active
                        ? t.dashboard?.deactivate || 'Deactivate'
                        : t.dashboard?.activate || 'Activate'}
                    </Button>

                    <div className="flex-1" />

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-xl border-border/50 px-4 font-bold hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                      onClick={() => router.push(`/post?edit=${listing.id}`)}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" />
                      {t.common?.edit || 'Edit'}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                    >
                      {deletingId === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
