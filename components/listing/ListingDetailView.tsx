'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { favoritesApi, messagesApi, listingsApi } from '@/lib/api'
import { ReportDialog } from '@/components/ui/report-dialog'
import { trackEvent } from '@/lib/utils/analytics'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { MobileImageGallery } from '@/components/listing/MobileImageGallery'
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  Tag,
  Heart,
  AlertTriangle,
  Loader2,
  Share2,
  ChevronRight,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from '@/lib/utils/listing-i18n'
import type { Listing } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ListingDetailViewProps {
  listing: Listing
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
  const { t, locale } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
  const [isContactLoading, setIsContactLoading] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)

  // Load initial favorite status
  useEffect(() => {
    if (!user) return
    favoritesApi.isFavorited(listing.id, user.id).then((res) => {
      if (res.data !== null) {
        setIsFavorited(res.data)
      }
    })
  }, [user, listing.id])

  // Track listing view
  useEffect(() => {
    trackEvent('listing_view', {
      listing_id: listing.id,
      category: listing.category?.slug,
    })
  }, [listing.id, listing.category?.slug])

  const handleContactClick = async (type: 'phone' | 'chat' | 'message') => {
    trackEvent('contact_click', {
      listing_id: listing.id,
      contact_type: type,
    })

    listingsApi.incrementContactClicks(listing.id)

    if (type === 'phone') {
      if (listing.user?.phone) {
        setShowPhone(!showPhone)
      } else {
        setShowPhone(true)
      }
      return
    }

    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (user.id === listing.user_id) {
      return
    }

    try {
      setIsContactLoading(true)
      const { data: conversation, error } = await messagesApi.getOrCreateConversation(
        listing.id,
        user.id,
        listing.user_id
      )

      if (error) throw error

      if (conversation) {
        router.push(`/messages/${conversation.id}`)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
    } finally {
      setIsContactLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setIsFavoriteLoading(true)
    const { data, error } = await favoritesApi.toggle(listing.id, user.id)
    if (!error && data) {
      setIsFavorited(data.isFavorited)
    }
    setIsFavoriteLoading(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: localizedTitle,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could show toast here
    }
  }

  const localizedTitle = getLocalizedTitle(listing, locale)
  const localizedDescription = getLocalizedDescription(listing, locale)

  const categoryName = (() => {
    if (!listing.category) return ''
    if (locale === 'sk') return listing.category.name_sk || listing.category.name
    if (locale === 'cs') return listing.category.name_cs || listing.category.name
    if (locale === 'en') return listing.category.name_en || listing.category.name
    return t.categories[listing.category.slug as keyof typeof t.categories] || listing.category.name
  })()

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-muted/30 pb-32 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 md:py-12 lg:px-8">
          {/* Breadcrumbs - Hidden on mobile */}
          <div className="hidden md:block">
            <Breadcrumbs
              items={[
                { label: t.common.allListings, href: '/listings' },
                ...(listing.category
                  ? [{ label: categoryName, href: `/categories/${listing.category.slug}` }]
                  : []),
                { label: localizedTitle },
              ]}
            />
          </div>

          {/* Mobile Header */}
          <div className="mb-4 flex items-center gap-2 md:hidden">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex-1" />
            <button
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriteLoading}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                isFavorited
                  ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-800 dark:bg-rose-950"
                  : "border-border/50 bg-card text-muted-foreground"
              )}
            >
              {isFavoriteLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
              )}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 md:mt-8 md:gap-12 lg:grid-cols-12">
            {/* Main Content */}
            <div className="space-y-6 md:space-y-8 lg:col-span-8">
              {/* Image Gallery */}
              <MobileImageGallery images={listing.images || []} alt={localizedTitle} />

              {/* Mobile Price & Title */}
              <div className="space-y-3 md:hidden">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">
                    {listing.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold uppercase text-muted-foreground">
                    {listing.currency}
                  </span>
                </div>
                <h1 className="text-2xl font-black leading-tight tracking-tight text-foreground">
                  {localizedTitle}
                </h1>
                {listing.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {listing.location}
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:rounded-[2.5rem] md:p-10 lg:p-16">
                {/* Desktop Title Section */}
                <div className="mb-8 hidden md:block">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl font-black leading-tight tracking-tighter text-foreground lg:text-5xl">
                      {localizedTitle}
                    </h1>
                    <div className="flex gap-2">
                      <button
                        onClick={handleShare}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-card text-muted-foreground transition-all hover:border-primary/50 hover:text-primary active:scale-95"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleToggleFavorite}
                        disabled={isFavoriteLoading}
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all active:scale-95",
                          isFavorited
                            ? "border-rose-100 bg-rose-50 text-rose-500 dark:border-rose-800 dark:bg-rose-950"
                            : "border-border bg-card text-muted-foreground hover:border-rose-200 hover:text-rose-500"
                        )}
                      >
                        {isFavoriteLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-primary">
                        {listing.price.toLocaleString()}
                      </span>
                      <span className="text-lg font-bold uppercase tracking-widest text-muted-foreground">
                        {listing.currency}
                      </span>
                    </div>
                    <div className="h-1 flex-1 rounded-full bg-border" />
                  </div>
                </div>

                <div className="prose prose-blue max-w-none">
                  <h3 className="mb-4 flex items-center gap-3 text-lg font-black text-foreground md:mb-6 md:text-2xl">
                    <div className="h-6 w-1.5 rounded-full bg-primary md:h-8 md:w-2" />
                    {t.listing.description}
                  </h3>
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground md:text-lg">
                    {localizedDescription}
                  </p>
                </div>
              </div>

              {/* Item Details - Mobile */}
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6 md:hidden">
                <h3 className="font-black text-foreground">{t.listing.itemDetails}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {listing.location && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                          {t.listing.location}
                        </p>
                        <p className="text-sm font-bold">{listing.location}</p>
                      </div>
                    </div>
                  )}
                  {listing.category && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                          {t.listing.category}
                        </p>
                        <p className="text-sm font-bold text-primary">{categoryName}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        {t.listing.postedOn}
                      </p>
                      <p className="text-sm font-bold">
                        {new Date(listing.created_at).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden space-y-6 lg:col-span-4 lg:block">
              {/* Contact Card */}
              <div className="sticky top-28 overflow-hidden rounded-[2.5rem] border-2 border-primary/10 bg-card p-8 shadow-2xl shadow-primary/10">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

                <h3 className="relative mb-6 text-xl font-black text-foreground">
                  {t.listing.contactSeller}
                </h3>

                <div className="relative space-y-3">
                  <Button
                    onClick={() => handleContactClick('phone')}
                    className="flex h-14 w-full gap-3 rounded-xl bg-primary text-base font-black text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/20"
                  >
                    <Phone className="h-5 w-5" />
                    {showPhone ? (listing.user?.phone || t.listing.callNow) : t.listing.callNow}
                  </Button>

                  <Button
                    onClick={() => handleContactClick('chat')}
                    disabled={isContactLoading}
                    className="flex h-14 w-full gap-3 rounded-xl bg-emerald-500 text-base font-black text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-emerald-500/20"
                  >
                    <MessageSquare className="h-5 w-5" /> {t.listing.liveChat}
                  </Button>

                  <Button
                    onClick={() => handleContactClick('message')}
                    disabled={isContactLoading}
                    variant="outline"
                    className="flex h-14 w-full gap-3 rounded-xl border-2 border-border text-base font-black text-muted-foreground transition-all hover:text-foreground"
                  >
                    <Mail className="h-5 w-5" /> {t.listing.sendMessage}
                  </Button>
                </div>

                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                  {t.listing.responseTime}
                </p>
              </div>

              {/* Metadata Card */}
              <div className="space-y-6 rounded-[2rem] border border-border bg-card p-8 shadow-xl shadow-primary/5">
                <h3 className="text-lg font-black text-foreground">{t.listing.itemDetails}</h3>

                <div className="space-y-5">
                  {listing.location && (
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {t.listing.location}
                        </p>
                        <p className="font-bold text-foreground">{listing.location}</p>
                      </div>
                    </div>
                  )}

                  {listing.category && (
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary">
                        <Tag className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {t.listing.category}
                        </p>
                        <Link
                          href={`/categories/${listing.category.slug}`}
                          className="font-bold text-primary hover:underline"
                        >
                          {categoryName}
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {t.listing.postedOn}
                      </p>
                      <p className="font-bold text-foreground">
                        {new Date(listing.created_at).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowReportDialog(true)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-rose-500"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {t.listing.reportListing}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed-bottom-bar border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3 p-4">
          <Button
            onClick={() => handleContactClick('phone')}
            className="h-14 flex-1 gap-2 rounded-xl bg-primary font-black shadow-lg"
          >
            <Phone className="h-5 w-5" />
            {t.listing.callNow}
          </Button>
          <Button
            onClick={() => handleContactClick('chat')}
            disabled={isContactLoading}
            className="h-14 flex-1 gap-2 rounded-xl bg-emerald-500 font-black shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
            {t.listing.liveChat}
          </Button>
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        listingId={listing.id}
      />
    </>
  )
}
