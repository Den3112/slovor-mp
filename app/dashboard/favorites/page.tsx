'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { favoritesApi } from '@/lib/api'
import type { Listing } from '@/lib/types/database'
import { ListingCard } from '@/components/listing/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader2, ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadFavorites = async () => {
      setIsLoading(true)
      const { data, error } = await favoritesApi.getByUser(user.id)
      if (error) {
        setError(error)
      } else {
        setFavorites(data || [])
      }
      setIsLoading(false)
    }

    loadFavorites()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 font-heading text-4xl font-black tracking-tight text-foreground">
            Favorites
          </h1>
          <p className="text-lg text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later.
          </p>
        </div>
        {favorites.length > 0 && (
          <Link href="/listings">
            <Button variant="outline" className="group rounded-2xl border-border/40 px-6 font-bold hover:bg-muted/50">
              Discover More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {favorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {favorites.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-border/50 bg-muted/5 py-24 text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-muted/50 text-muted-foreground">
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="mb-2 font-heading text-2xl font-bold italic">Your bucket is empty</h3>
            <p className="mb-8 max-w-xs text-muted-foreground">
              Save interesting items while browsing to see them here later.
            </p>
            <Link href="/listings">
              <Button className="h-14 rounded-2xl px-10 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                <Search className="mr-2 h-4 w-4" />
                Start Exploring
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-500">
          <p className="font-bold">Error: {error}</p>
        </div>
      )}
    </div>
  )
}
