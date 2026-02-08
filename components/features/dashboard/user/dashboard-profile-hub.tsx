'use client'

import { useTranslation } from '@/lib/i18n'
import { ProfileCard } from '@/components/seller-profile/profile-card'
import { ProfileStrength } from './profile-strength'
import { IdentityWidget } from './identity-widget'
import { ListingCard } from '@/components/listing/card'
import { PremiumBackground } from '@/components/ui/premium-background'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLink, Plus } from 'lucide-react'
import type { Profile } from '@/lib/types/database'
import type { Listing } from '@/lib/api'

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
    <PremiumBackground variant="mesh" className="py-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="from-foreground to-foreground/60 bg-gradient-to-br bg-clip-text text-3xl font-black tracking-tighter text-transparent uppercase sm:text-4xl">
              {t('profile:hubTitle', { defaultValue: 'My Profile' })}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {t('profile:hubSubtitle', {
                defaultValue: 'Manage your public presence and reputation.',
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/${locale}/seller/${seller.id}`} target="_blank">
              <Button
                variant="outline"
                className="border-border hover:bg-accent gap-2 rounded-xl"
              >
                <ExternalLink className="h-4 w-4" />
                {t('profile:viewPublic', { defaultValue: 'View Public' })}
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/settings`}>
              <Button className="shadow-primary/20 rounded-xl shadow-lg">
                {t('profile:editProfile', { defaultValue: 'Edit Profile' })}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: ID Card */}
          <div className="space-y-6 lg:col-span-4">
            <ProfileCard
              seller={seller}
              listingsCount={listings.length}
              ratingData={null} // We can fetch this if needed, or leave as null for owner view
              memberSince={new Date(seller.created_at).toLocaleDateString()}
            />
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6 lg:col-span-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <ProfileStrength percentage={score} missingFields={missing} />
              <IdentityWidget isVerified={seller.verified || false} />
            </div>

            {/* Active Listings Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight uppercase">
                  {t('seller:activeListings')}
                </h2>
                <Link href={`/${locale}/dashboard/my-listings`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary text-xs font-bold tracking-widest uppercase"
                  >
                    {t('common:viewAll')}
                  </Button>
                </Link>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {listings.slice(0, 2).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-card border-border flex flex-col items-center justify-center rounded-3xl border p-12 text-center shadow-sm">
                  <div className="bg-primary/10 ring-primary/5 mb-4 rounded-full p-4 ring-8">
                    <Plus className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {t('seller:noListings')}
                  </h3>
                  <p className="text-muted-foreground my-2 max-w-xs text-sm">
                    {t('seller:startSellingDescription', {
                      defaultValue:
                        'Create your first listing to start selling.',
                    })}
                  </p>
                  <Link href={`/${locale}/listings/create`}>
                    <Button className="mt-4 rounded-xl">
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
