'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { listingsApi } from '@/shared/lib/api'
import { createClient } from '@/shared/lib/supabase/client'
import { useTranslation } from '@/shared/lib/i18n'
import type { Listing } from '@/shared/lib/types/database'
import {
  Rocket,
  Search,
  ArrowRight,
  Loader2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '@/shared/ui/empty-state'
import { Input } from '@/shared/ui/input'
import { formatPrice } from '@/shared/lib/utils/formatting'
import { useCurrency } from '@/app/providers/currency-provider'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'

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
      const supabase = createClient()
      const { data } = await listingsApi.getByUser(supabase, userId)
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
      {/* Promotion Plans Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            id: 'free',
            title: t('dashboard:promote.plans.free.title'),
            price: 0,
            icon: Calendar,
            color: 'zinc',
            glow: 'shadow-zinc-500/10',
          },
          {
            id: 'standard',
            title: t('dashboard:promote.plans.standard.title'),
            price: Number(t('dashboard:promote.plans.standard.price')),
            icon: ArrowRight,
            color: 'blue',
            glow: 'shadow-blue-500/10',
          },
          {
            id: 'premium',
            title: t('dashboard:promote.plans.premium.title'),
            price: Number(t('dashboard:promote.plans.premium.price')),
            icon: Rocket,
            color: 'amber',
            glow: 'shadow-amber-500/10',
          },
        ].map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'glass-panel border-primary/10 bg-background/20 relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 hover:scale-[1.02]',
              plan.glow
            )}
          >
            <div className="relative z-10 flex flex-col gap-6">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg',
                  plan.color === 'blue'
                    ? 'border-blue-200 bg-blue-500/10 text-blue-600'
                    : plan.color === 'amber'
                      ? 'border-amber-200 bg-amber-500/10 text-amber-600 shadow-amber-500/20'
                      : 'border-zinc-200 bg-zinc-500/10 text-zinc-600'
                )}
              >
                <plan.icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-foreground text-base font-black tracking-tight uppercase">
                  {plan.title}
                </p>
                <p className="text-muted-foreground mt-1 text-[10px] font-black tracking-[0.2em] uppercase opacity-70">
                  {plan.id === 'free'
                    ? t('dashboard:promote.plans.free.subtitle')
                    : t('dashboard:promote.plans.' + plan.id + '.subtitle')}
                </p>
              </div>

              <div className="mt-2">
                <p className="text-foreground text-3xl font-black tracking-tighter tabular-nums">
                  {formatPrice(plan.price, 'RUB')}
                </p>
              </div>
            </div>
            <div className="bg-primary/5 absolute -right-6 -bottom-6 h-32 w-32 rounded-full opacity-50 blur-3xl" />
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="glass-panel border-primary/10 bg-background/10 shadow-primary/5 overflow-hidden rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex flex-col gap-10">
          {/* Header & Search */}
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <h2 className="text-foreground flex items-center gap-3 text-2xl font-black tracking-tighter whitespace-nowrap uppercase">
                <Rocket className="text-primary h-7 w-7" />
                {t('dashboard:promote.selectListing')}
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 rounded-xl px-3 py-1 text-[10px] font-black tracking-widest"
                >
                  {filteredListings.length}
                </Badge>
              </h2>
              <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase opacity-60">
                {t('dashboard:promote.selectDescription', {
                  defaultValue: 'Choose a listing to boost its visibility',
                })}
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="text-primary/40 absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2" />
              <Input
                type="text"
                placeholder={t('dashboard:searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-panel border-primary/10 focus-visible:ring-primary/20 bg-background/50 h-16 rounded-2xl pl-14 text-sm font-black shadow-inner"
              />
            </div>
          </div>

          <div className="via-primary/10 h-px bg-linear-to-r from-transparent to-transparent" />

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() =>
                      router.push(`/${locale}/listings/${listing.id}/promote`)
                    }
                    className="group glass-panel border-primary/5 bg-background/20 hover:border-primary/30 hover:shadow-primary/10 shadow-soft cursor-pointer overflow-hidden rounded-[2rem] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                  >
                    <div className="flex h-full flex-col">
                      <div className="relative aspect-video w-full overflow-hidden">
                        {listing.images?.[0] ? (
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="bg-primary/5 flex h-full w-full items-center justify-center">
                            <ImageIcon className="text-primary/20 h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {(listing.is_highlighted && (
                          <div className="glass-panel absolute top-4 left-4 z-10 rounded-xl border-amber-400/50 bg-amber-500/90 px-3 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg shadow-amber-500/40 backdrop-blur-md">
                            {t('dashboard:promoted')}
                          </div>
                        )) || (
                          <div className="glass-panel bg-primary/20 absolute top-4 left-4 z-10 rounded-xl border-white/20 px-3 py-1.5 text-[9px] font-black tracking-widest text-white uppercase opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                            {t('dashboard:promote.available', {
                              defaultValue: 'Ready to Boost',
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col space-y-6 p-8">
                        <div className="space-y-2">
                          <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-black tracking-tight uppercase transition-colors duration-300">
                            {listing.title}
                          </h3>
                          <div className="text-muted-foreground/60 flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase">
                            <Calendar className="text-primary/40 mt-[-2px] h-3.5 w-3.5" />
                            {new Date(listing.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground/40 mb-1 text-[9px] font-black tracking-widest uppercase">
                              {t('dashboard:price')}
                            </span>
                            <span className="text-foreground text-2xl font-black tracking-tighter tabular-nums">
                              {formatPrice(
                                listing.price,
                                currency || listing.currency
                              )}
                            </span>
                          </div>
                          <div className="bg-primary/10 text-primary group-hover:bg-primary shadow-soft group-hover:shadow-primary/30 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-white">
                            <ArrowRight className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-20">
              <EmptyState
                icon={Rocket}
                title={t('dashboard:noListings')}
                description={t('dashboard:noActiveListingsDescription')}
                actionLabel={t('dashboard:newListing')}
                actionHref={`/${locale}/post`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
