import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { messagesApi } from '@/lib/api/messages'
import { toast } from 'sonner'
import type { Listing } from '@/lib/types/database'

export function useListingActions(listing: Listing) {
  const router = useRouter()
  const { user } = useAuth()
  const [isContacting, setIsContacting] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const handleContact = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/listings/${listing.id}`)
      return
    }

    if (user.id === listing.user_id) {
      toast.error('You cannot message yourself')
      return
    }

    setIsContacting(true)
    try {
      const { data, error } = await messagesApi.getOrCreateConversation(
        listing.id,
        user.id,
        listing.user_id
      )

      if (error) throw new Error(error)

      if (data) {
        router.push(`/messages/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
      toast.error('Failed to start conversation')
    } finally {
      setIsContacting(false)
    }
  }

  const handleCall = () => {
    if (!listing.user?.phone) {
      toast.error('Seller has not provided a phone number')
      return
    }
    setShowPhone(true)
    window.location.href = `tel:${listing.user.phone}`
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      })
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  return {
    handleContact,
    handleCall,
    handleShare,
    isContacting,
    showPhone,
  }
}
