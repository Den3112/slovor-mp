'use client'

import { useEffect, useState } from 'react'
import { listingsApi } from '@/shared/lib/api'
import { ListingCard } from './listing-card'
import { useTranslation } from '@/shared/lib/i18n'
import type { Listing } from '@/shared/lib/types/database'
import { motion } from 'framer-motion'

interface RelatedListingsProps {
  categoryId?: string
  currentListingId: string
}

export function RelatedListings({
  categoryId,
  currentListingId,
}: RelatedListingsProps) {
  const { t } = useTranslation(['common', 'listing'])
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      if (!categoryId) return

      setIsLoading(true)
      try {
        const { data } = await listingsApi.getAll({
          categoryId,
          limit: 5, // Fetch 5 to filter out current one and show 4
        })

        if (data) {
          const filtered = data
            .filter((l) => l.id !== currentListingId)
            .slice(0, 4)
          setListings(filtered)
        }
      } catch (error) {
        console.error('Failed to fetch related listings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelated()
  }, [categoryId, currentListingId])

  if (!isLoading && listings.length === 0) return null

  return (
    <section className="border-border/40 border-t py-20">
      <div className="mb-12 flex items-end justify-between">
        <div className="space-y-2">
          <span className="text-primary/60 text-[10px] font-black tracking-[0.4em] uppercase">
            {t('listing:discovery')}
          </span>
          <h2 className="text-4xl font-black tracking-tight">
            {t('listing:relatedListings')}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted aspect-4/3 animate-pulse rounded-4xl"
              />
            ))
          : listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
      </div>
    </section>
  )
}
