// Listing Detail Page - Server Component
// Principle #4: Explicit data fetching

import { notFound } from 'next/navigation'
import { listingsApi } from '@/lib/supabase/queries'
import { ImageGallery } from '@/components/listing/image-gallery'
import { ErrorState } from '@/components/ui/error-state'
import {
  MapPin,
  Eye,
  Calendar,
  Sparkles,
  PackageCheck,
  Share2,
  Heart,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { getTranslationServer } from '@/lib/i18n/server'
import Link from 'next/link'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const { t } = await getTranslationServer()
  const result = await listingsApi.getById(id)

  if (result.error) {
    return <ErrorState message={result.error} />
  }

  if (!result.data) {
    notFound()
  }

  const listing = result.data

  return (
    <div className="min-h-screen pb-20">
      {/* Breadcrumbs / Back button */}
      <Container className="py-6 pt-24 md:pt-32">
        <Link
          href="/listings"
          className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t.common.backToSearch}
        </Link>
      </Container>

      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Content Area (Left) */}
          <div className="space-y-12 lg:col-span-8">
            {/* Image Section */}
            <div className="shadow-premium overflow-hidden rounded-[2.5rem] border border-border/50 bg-card">
              <ImageGallery
                images={listing.images || []}
                title={listing.title}
              />
            </div>

            {/* Description & Details */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="font-heading text-3xl font-black italic tracking-tight">
                  {t.listing.itemDescription}
                </h2>
                <div className="h-1.5 w-20 rounded-full bg-primary" />
                <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-foreground/80">
                  {listing.description}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-6">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {t.common.condition}
                  </p>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    {listing.condition === 'new' ? (
                      <>
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        <span>{t.common.new}</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="h-5 w-5 text-amber-500" />
                        <span>{t.common.used}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-6">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {t.common.location}
                  </p>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-6">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {t.common.published}
                  </p>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="space-y-8 lg:col-span-4">
            {/* Price & Primary Ops Card */}
            <div className="shadow-premium sticky top-28 space-y-8 rounded-[2.5rem] border border-border bg-card p-8">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {t.common.price}
                </span>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-black tracking-tighter text-foreground">
                    {listing.price.toLocaleString()}
                  </h1>
                  <span className="text-xl font-bold text-muted-foreground">
                    {listing.currency}
                  </span>
                </div>
              </div>

              <div className="space-y-4 border-t border-border/50 pt-6">
                <h3 className="font-heading text-xl font-black italic">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {listing.views} {t.common.views}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    {t.trust.verified}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <Button
                  size="lg"
                  className="h-16 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                >
                  {t.listing.contactSeller}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 gap-2 rounded-xl font-bold"
                  >
                    <Heart className="h-5 w-5" /> {t.listing.saveListing}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 gap-2 rounded-xl font-bold"
                  >
                    <Share2 className="h-5 w-5" /> {t.listing.shareListing}
                  </Button>
                </div>
              </div>

              {/* Safety Tip */}
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
                <div className="flex gap-4">
                  <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {t.trust.safetyTitle}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {t.trust.safetyTip2} {t.trust.safetyTip1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
