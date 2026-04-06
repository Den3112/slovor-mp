'use client'

import { useTranslation } from '@/shared/lib/i18n'
import { ProfileCard } from '@/features/seller-profile'
import { ProfileStrength } from './profile-strength'
import { IdentityWidget } from './identity-widget'
import { ListingCard } from '@/entities/listing'
import { PremiumBackground } from '@/shared/ui/premium-background'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import { ExternalLink, Plus } from 'lucide-react'
import type { Profile } from '@/shared/lib/types/database'
import type { Listing } from '@/shared/lib/api'

interface DashboardProfileHubProps {
  seller: Profile
  listings: Listing[]
}

export function DashboardProfileHub({
  seller,
  listings,
}: DashboardProfileHubProps) {
  const { t, locale } = useTranslation(['profile', 'common', 'seller'])

  // Calculate profile strength
  const calculateStrength = () => {
    let score = 0
    const missing: string[] = []

    if (seller.avatar_url) score += 20
    else missing.push('Avatar')
    if (seller.bio) score += 20
    else missing.push('Bio')
    if (seller.phone) score += 20
    else missing.push('Phone')
    if (seller.verified) score += 20
    else missing.push('Identity Verification')
    if (listings.length > 0) score += 20
    else missing.push('First Listing')

    return { score, missing }
  }

  const { score, missing } = calculateStrength()

  return (
    <PremiumBackground variant="mesh" className="py-8">
      <div className="animate-in fade-in slide-in-from-bottom-6 mx-auto max-w-7xl space-y-12 duration-1000">
        {/* Header Actions */}
        <div className="flex flex-col gap-6 px-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-foreground text-4xl font-black tracking-tighter uppercase sm:text-5xl lg:text-6xl">
              {t('profile:hubTitle', { defaultValue: 'My Profile' })}
            </h1>
            <p className="text-primary/40 text-xs font-black tracking-[0.2em] uppercase">
              {t('profile:hubSubtitle', {
                defaultValue: 'Manage your public presence and reputation.',
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/seller/${seller.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-border hover:bg-primary h-12 gap-3 rounded-xl px-6 text-[10px] font-black tracking-[0.15em] uppercase transition-all hover:text-white active:scale-95"
              >
                <ExternalLink className="h-4 w-4 stroke-3" />
                {t('profile:viewPublic', { defaultValue: 'View Public' })}
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/settings`}>
              <Button className="shadow-primary/20 hover:bg-primary/90 h-12 gap-3 rounded-xl px-8 text-[10px] font-black tracking-[0.15em] uppercase shadow-md transition-all active:scale-95">
                {t('profile:editProfile', { defaultValue: 'Edit Profile' })}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: ID Card */}
          <div className="h-fit lg:sticky lg:top-24 lg:col-span-4">
            <ProfileCard
              seller={seller}
              listingsCount={listings.length}
              ratingData={null}
              memberSince={new Date(seller.created_at).toLocaleDateString(
                locale,
                { month: 'long', year: 'numeric' }
              )}
            />
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-10 lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <ProfileStrength percentage={score} missingFields={missing} />
              <IdentityWidget isVerified={seller.verified || false} />
            </div>

            {/* Active Listings Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary shadow-primary/20 h-6 w-1 rounded-full shadow-lg" />
                  <h2 className="text-foreground text-xl font-black tracking-tighter uppercase">
                    {t('seller:activeListings')}
                  </h2>
                </div>
                <Link href={`/${locale}/dashboard/listings`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/5 hover:text-primary h-8 rounded-xl px-4 text-[9px] font-black tracking-[0.2em] uppercase transition-all active:scale-95"
                  >
                    {t('common:viewAll')}
                  </Button>
                </Link>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {listings.slice(0, 2).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-card border-border flex flex-col items-center justify-center rounded-2xl border p-16 text-center shadow-md">
                  <div className="bg-primary/5 border-primary/5 mb-8 flex h-20 w-20 items-center justify-center rounded-xl border shadow-inner transition-transform duration-700 hover:scale-110">
                    <Plus className="text-primary/20 h-8 w-8 stroke-3" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-black tracking-tighter uppercase">
                    {t('seller:noListings')}
                  </h3>
                  <p className="text-foreground/40 mx-auto mb-10 max-w-xs text-[11px] leading-relaxed font-black tracking-tight uppercase">
                    {t('seller:startSellingDescription', {
                      defaultValue:
                        'Create your first listing to start selling.',
                    })}
                  </p>
                  <Link href={`/${locale}/listings/page`}>
                    <Button className="shadow-primary/20 hover:bg-primary/90 h-12 rounded-xl px-10 text-[10px] font-black tracking-[0.2em] uppercase shadow-md transition-all active:scale-95">
                      {t('common:createListing', {
                        defaultValue: 'Create Listing',
                      })}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PremiumBackground>
  )
}
