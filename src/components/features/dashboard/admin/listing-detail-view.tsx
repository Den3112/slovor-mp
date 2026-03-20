'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  DollarSign,
  Eye,
  Clock,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ListingStatusBadge } from '@/components/features/dashboard/shared/listing-status-badge'
import { listingsApi } from '@/lib/api'
import { Listing } from '@/lib/types/database'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils/formatting'

import { User } from '@supabase/supabase-js'
import { Category } from '@/lib/api'

interface AdminListingDetailViewProps {
  listing: Listing & { user: User | null; category: Category | null }
}

export function AdminListingDetailView({
  listing: initialListing,
}: AdminListingDetailViewProps) {
  const { t } = useTranslation(['admin', 'common', 'dashboard'])
  const router = useRouter()
  const [listing, setListing] = useState(initialListing)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: 'approve' | 'reject' | 'delete') => {
    try {
      setIsProcessing(true)
      if (action === 'delete') {
        if (!confirm(t('admin:confirmDeleteListing'))) return
        await listingsApi.delete(listing.id)
        toast.success(t('admin:listingDeleted'))
        router.push('/admin/listings')
      } else {
        const status = action === 'approve' ? 'active' : 'rejected'
        await listingsApi.update(listing.id, { status })
        setListing((prev) => ({ ...prev, status }))
        toast.success(
          t(
            action === 'approve'
              ? 'admin:listingApproved'
              : 'admin:listingRejected'
          )
        )
      }
    } catch (error) {
      toast.error(t('common:errorOccurred'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{listing.title}</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {listing.category?.name || 'Uncategorized'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(listing.created_at).toLocaleDateString()}
            </span>
            <span>•</span>
            <ListingStatusBadge status={listing.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/listings/${listing.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('common:viewPublic')}
            </Link>
          </Button>
          {(listing.status === 'pending' || listing.status === 'rejected') && (
            <Button
              onClick={() => handleAction('approve')}
              disabled={isProcessing}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {t('admin:approve')}
            </Button>
          )}
          {(listing.status === 'pending' || listing.status === 'active') && (
            <Button
              variant="destructive"
              onClick={() => handleAction('reject')}
              disabled={isProcessing}
              className="border-none bg-amber-600 text-white hover:bg-amber-700"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t('admin:reject')}
            </Button>
          )}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleAction('delete')}
            disabled={isProcessing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin:listingImages')}</CardTitle>
            </CardHeader>
            <CardContent>
              {listing.images && listing.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {listing.images.map((img, i) => (
                    <div
                      key={i}
                      className="bg-muted relative aspect-square overflow-hidden rounded-xl border"
                    >
                      <Image
                        src={img}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground flex h-32 items-center justify-center rounded-xl border-2 border-dashed">
                  {t('admin:noImages')}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin:description')}</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">
                {listing.description || t('admin:noDescription')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin:attributes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-bold uppercase">
                    {t('admin:price')}
                  </span>
                  <div className="flex items-center gap-2 font-medium">
                    <DollarSign className="text-primary h-4 w-4" />
                    {formatPrice(listing.price, listing.currency)}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-bold uppercase">
                    {t('admin:location')}
                  </span>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="text-primary h-4 w-4" />
                    {listing.location || t('admin:na')}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-bold uppercase">
                    {t('admin:views')}
                  </span>
                  <div className="flex items-center gap-2 font-medium">
                    <Eye className="text-primary h-4 w-4" />
                    {listing.views_count || 0}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-bold uppercase">
                    {t('admin:created')}
                  </span>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="text-primary h-4 w-4" />
                    {new Date(listing.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin:sellerDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="border-background relative h-20 w-20 overflow-hidden rounded-full border-4 shadow-xl">
                  {listing.user?.avatar_url ? (
                    <Image
                      src={listing.user.avatar_url}
                      alt={listing.user?.display_name || 'Seller avatar'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-secondary flex h-full w-full items-center justify-center">
                      <UserIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {listing.user?.display_name || t('admin:unknownUser')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {listing.user?.email}
                  </p>
                </div>
                <Separator />
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('admin:joined')}
                    </span>
                    <span>
                      {new Date(
                        listing.user?.created_at || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('admin:verificationLevel')}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {listing.user?.verification_level || 'None'}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/users/${listing.user_id}`}>
                    {t('admin:viewUserProfile')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
