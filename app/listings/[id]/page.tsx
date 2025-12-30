// Listing Detail Page - Server Component
// Principle #4: Explicit data fetching

import { notFound } from 'next/navigation'
import { listingsApi } from '@/lib/supabase/queries'
import { ImageGallery } from '@/components/listing/image-gallery'
import { ErrorState } from '@/components/ui/error-state'
import { MapPin, Eye, Calendar, Sparkles, PackageCheck, Share2, Heart, ShieldCheck, ArrowLeft } from 'lucide-react'
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
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.common.backToSearch}
        </Link>
      </Container>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Section */}
            <div className="rounded-[2.5rem] overflow-hidden border border-border/50 bg-card shadow-premium">
              <ImageGallery
                images={listing.images || []}
                title={listing.title}
              />
            </div>

            {/* Description & Details */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight font-heading italic">{t.listing.itemDescription}</h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
                <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                  {listing.description}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{t.common.condition}</p>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    {listing.condition === 'new' ? (
                      <>
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <span>{t.common.new}</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-5 h-5 text-amber-500" />
                        <span>{t.common.used}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{t.common.location}</p>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{t.common.published}</p>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Price & Primary Ops Card */}
            <div className="sticky top-28 p-8 rounded-[2.5rem] bg-card border border-border shadow-premium space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{t.common.price}</span>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-black tracking-tighter text-foreground">
                    {listing.price.toLocaleString()}
                  </h1>
                  <span className="text-xl font-bold text-muted-foreground">{listing.currency}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 space-y-4">
                <h3 className="font-heading font-black text-xl italic">{listing.title}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {listing.views} {t.common.views}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {t.trust.verified}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
                  {t.listing.contactSeller}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" className="h-14 rounded-xl font-bold gap-2">
                    <Heart className="w-5 h-5" /> {t.listing.saveListing}
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 rounded-xl font-bold gap-2">
                    <Share2 className="w-5 h-5" /> {t.listing.shareListing}
                  </Button>
                </div>
              </div>

              {/* Safety Tip */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.trust.safetyTitle}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
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
