'use client'

import { useState } from 'react'
import { ListingDetailView } from '@/entities/listing/ui/listing-detail-view'
import { CheckoutDialog } from '@/features/checkout'
import type { Listing } from '@/shared/lib/types/database'

interface ListingDetailsWidgetProps {
  listing: Listing
}

export function ListingDetailsWidget({ listing }: ListingDetailsWidgetProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <>
      <ListingDetailView
        listing={listing}
        checkoutSlot={
          <CheckoutDialog
            listing={listing}
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        }
      />
    </>
  )
}
