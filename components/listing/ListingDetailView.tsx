'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { favoritesApi } from '@/lib/api'
import { ReportDialog } from '@/components/ui/report-dialog'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
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
  Share2
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
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
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

  const handleToggleFavorite = async () => {
    if (!user) {
      // Could show a login modal or redirect
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

  const handleReport = () => {
    setShowReportDialog(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: localizedTitle,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Get localized content
  const localizedTitle = getLocalizedTitle(listing, locale)
  const localizedDescription = getLocalizedDescription(listing, locale)

  // Dynamic locale check for category name
  const categoryName = (() => {
    if (!listing.category) return ''
    if (locale === 'sk')
      return listing.category.name_sk || listing.category.name
    if (locale === 'cs')
      return listing.category.name_cs || listing.category.name
    if (locale === 'en')
      return listing.category.name_en || listing.category.name
    return (
      t.categories[listing.category.slug as keyof typeof t.categories] ||
      listing.category.name
    )
  })()

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50/50 pb-20">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: t.common.allListings, href: '/listings' },
            ...(listing.category
              ? [
                {
                  label: categoryName,
                  href: `/categories/${listing.category.slug}`,
                },
              ]
              : []),
            { label: localizedTitle },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-8">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="group overflow-hidden rounded-[3rem] border border-gray-100 bg-white shadow-2xl shadow-blue-900/5">
                {listing.images && listing.images[activeImage] ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={listing.images[activeImage]}
                      alt={localizedTitle}
                      fill
                      className="object-cover transition-all duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-gray-50">
                    <span className="text-9xl opacity-10 grayscale">📷</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-4 transition-all ${activeImage === idx ? 'scale-105 border-blue-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <Image
                        src={img}
                        alt={`${localizedTitle} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="rounded-[3rem] border border-gray-50 bg-white p-10 shadow-xl shadow-blue-900/5 md:p-16">
              <div className="mb-10 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl font-black leading-tight tracking-tighter text-gray-900 md:text-6xl">
                    {localizedTitle}
                  </h1>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white text-gray-400 transition-all hover:border-blue-200 hover:text-blue-600 active:scale-95"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleToggleFavorite}
                      disabled={isFavoriteLoading}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all active:scale-95",
                        isFavorited
                          ? "border-rose-100 bg-rose-50 text-rose-500"
                          : "border-gray-100 bg-white text-gray-400 hover:border-rose-200 hover:text-rose-500"
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
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-blue-600">
                      {listing.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-bold uppercase tracking-widest text-gray-400">
                      {listing.currency}
                    </span>
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-gray-100" />
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-black text-gray-900">
                  <div className="h-8 w-2 rounded-full bg-blue-600" />
                  {t.listing.description}
                </h3>
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-600">
                  {localizedDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-4">
            {/* Contact Card */}
            <div className="sticky top-32 overflow-hidden rounded-[3rem] border-4 border-blue-50 bg-white p-10 shadow-2xl shadow-blue-600/10">
              {/* Decorative background circle */}
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-600/5 blur-3xl" />

              <h3 className="relative mb-8 text-2xl font-black text-gray-900">
                {t.listing.contactSeller}
              </h3>

              <div className="relative space-y-4">
                <Button className="flex w-full gap-3 rounded-2xl bg-blue-600 py-8 text-lg font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200">
                  <Phone className="h-6 w-6" /> {t.listing.callNow}
                </Button>

                <Button className="flex w-full gap-3 rounded-2xl bg-green-500 py-8 text-lg font-black text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-green-100">
                  <MessageSquare className="h-6 w-6" /> {t.listing.liveChat}
                </Button>

                <Button
                  variant="outline"
                  className="flex w-full gap-3 rounded-2xl border-2 border-gray-100 py-8 text-lg font-black text-gray-500 transition-all hover:text-gray-900"
                >
                  <Mail className="h-6 w-6" /> {t.listing.sendMessage}
                </Button>
              </div>

              <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                {t.listing.responseTime}
              </p>
            </div>

            {/* Metadata Card */}
            <div className="space-y-8 rounded-[2.5rem] border border-gray-50 bg-white p-10 shadow-xl shadow-blue-900/5">
              <h3 className="mb-2 text-xl font-black text-gray-900">
                {t.listing.itemDetails}
              </h3>

              <div className="space-y-6">
                {listing.location && (
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-blue-600">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {t.listing.location}
                      </p>
                      <p className="font-bold text-gray-900">
                        {listing.location}
                      </p>
                    </div>
                  </div>
                )}

                {listing.category && (
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-blue-600">
                      <Tag className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {t.listing.category}
                      </p>
                      <Link
                        href={`/categories/${listing.category.slug}`}
                        className="font-bold text-blue-600 underline decoration-2 underline-offset-4 hover:text-blue-700"
                      >
                        {categoryName}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-blue-600">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t.listing.postedOn}
                    </p>
                    <p className="font-bold text-gray-900">
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

            {/* Report listing button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReport}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-rose-500"
              >
                <AlertTriangle className="h-3 w-3" />
                {t.listing.reportListing}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        listingId={listing.id}
      />
    </div>
  )
}
