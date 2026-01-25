'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  listingId: string
  initialIsFavorited?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  default: 'h-10 w-10 md:h-9 md:w-9',
  lg: 'h-12 w-12',
}

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  default: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function FavoriteButton({
  listingId,
  initialIsFavorited = false,
  className,
  size = 'default',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Fetch actual state on mount if not provided (or to verify)
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Check session first to avoid 406 errors for unauthenticated users
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', session.user.id)
        .maybeSingle()

      setIsFavorited(Boolean(data))
    }

    // Only fetch if we are unsure or want strictly fresh state.
    // For now we'll trust initial if passed, but verify.
    checkFavoriteStatus()
  }, [listingId, supabase])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if inside a link
    e.stopPropagation()

    if (isLoading) return

    // Optimistic update
    const previousState = isFavorited
    setIsFavorited(!previousState)
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Revert and redirect to login
      setIsFavorited(previousState)
      setIsLoading(false)
      router.push('/auth/login')
      return
    }

    try {
      if (previousState) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert({ listing_id: listingId, user_id: user.id })

        if (error) {
          // If unique constraint violation (already favorited), just ignore
          if (error.code === '23505') {
            console.warn('Already favorited')
          } else {
            throw error
          }
        }
      }

      router.refresh()
    } catch (error) {
      console.error('Error toggling favorite:', JSON.stringify(error, null, 2))
      setIsFavorited(previousState) // Revert
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      className={cn(
        'group/fav relative flex items-center justify-center rounded-full transition-all active:scale-90',
        sizeClasses[size],
        isFavorited
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
          : 'bg-black/20 text-white/80 backdrop-blur-md hover:bg-white hover:text-red-500 hover:shadow-lg',
        className
      )}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          iconSizeClasses[size],
          'transition-all duration-300',
          isFavorited && 'scale-110 fill-current',
          isLoading && 'opacity-50'
        )}
      />
    </button>
  )
}
