'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { listingsApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'
import {
  Rocket,
  Search,
  ArrowRight,
  Loader2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils/formatting'
import { useCurrency } from '@/components/providers/currency-provider'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PromoteViewProps {
  userId: string
}

export function PromoteView({ userId }: PromoteViewProps) {
  const { t, locale } = useTranslation(['dashboard', 'common'])
  const { currency } = useCurrency()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchListings() {
      if (!userId) return
      const { data } = await listingsApi.getByUser(userId)
      if (data) {
        // Only show active listings for promotion
        setListings(data.filter((l: Listing) => l.status === 'active'))
      }
      setIsLoading(false)
    }
    fetchListings()
  }, [userId])

  const filteredListings = listings.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Promotion Plans Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            id: 'free',
            title: t('dashboard:promote.plans.free.title'),
            price: 0,
            icon: Calendar,
            color: 'zinc',
          },
          {
            id: 'standard',
            title: t('dashboard:promote.plans.standard.title'),
            price: Number(t('dashboard:promote.plans.standard.price')),
            icon: ArrowRight,
            color: 'blue',
          },
          {
            id: 'premium',
            title: t('dashboard:promote.plans.premium.title'),
            price: Number(t('dashboard:promote.plans.premium.price')),
            icon: Rocket,
            color: 'amber',
          },
        ].map((plan) => (
          <div
            key={plan.id}
            className="bg-card border-border/60 flex items-center justify-between rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg border',
                  plan.color === 'blue'
                    ? 'border-blue-200 bg-blue-500/10 text-blue-600 dark:border-blue-900'
                    : plan.color === 'amber'
                      ? 'border-amber-200 bg-amber-500/10 text-amber-600 dark:border-amber-900'
                      : 'border-zinc-200 bg-zinc-500/10 text-zinc-600 dark:border-zinc-800'
                )}
              >
                <plan.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-sm font-bold tracking-tight uppercase">
                  {plan.title}
                </p>
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  {plan.id === 'free'
                    ? t('dashboard:promote.plans.free.subtitle')
                    : t('dashboard:promote.plans.' + plan.id + '.subtitle')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-foreground text-lg font-bold tracking-tighter">
                {formatPrice(plan.price, 'RUB')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="group relative max-w-xl">
        <Search className="text-muted-foreground/50 group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
        <Input
          type="text"
          placeholder={t('dashboard:searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-card w-full rounded-lg px-12 py-6 text-sm font-bold shadow-sm"
        />
      </div>

      {/* Listings Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:promote.selectListing')}
            <Badge
              variant="secondary"
              className="bg-muted/50 rounded-md px-1.5 py-0 text-[9px] font-bold tracking-widest"
            >
              {filteredListings.length}
            </Badge>
          </h2>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() =>
                    router.push(`/${locale}/listings/${listing.id}/promote`)
                  }
                  className="group border-border/60 bg-card hover:border-primary/50 hover:shadow-primary/5 cursor-pointer overflow-hidden rounded-2xl border transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="flex h-full flex-col">
                    <div className="bg-muted border-border/10 relative aspect-video w-full overflow-hidden border-b">
                      {listing.images?.[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground/10 h-10 w-10" />
                        </div>
                      )}
                      {listing.is_highlighted && (
                        <div className="absolute top-4 left-4 z-10 rounded-lg bg-amber-500 px-3 py-1.5 text-[8px] font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-amber-500/20">
                          {t('dashboard:promoted')}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="flex flex-1 flex-col space-y-4 p-6">
                      <div className="space-y-1.5">
                        <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-base font-bold tracking-tight uppercase transition-colors">
                          {listing.title}
                        </h3>
                        <div className="text-muted-foreground/60 flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase">
                          <Calendar className="mt-[-2px] h-3.5 w-3.5" />
                          {new Date(listing.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground/40 mb-[-2px] text-[9px] font-bold tracking-widest uppercase">
                            {t('dashboard:price')}
                          </span>
                          <span className="text-foreground text-xl font-bold tracking-tighter">
                            {formatPrice(
                              listing.price,
                              currency || listing.currency
                            )}
                          </span>
                        </div>
                        <div className="bg-primary/10 text-primary group-hover:bg-primary flex h-11 w-11 items-center justify-center rounded-lg transition-all group-hover:text-white">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            icon={Rocket}
            title={t('dashboard:noListings')}
            description={t('dashboard:noActiveListingsDescription')}
            actionLabel={t('dashboard:newListing')}
            actionHref={`/${locale}/post`}
          />
        )}
      </div>
    </div>
  )
}
