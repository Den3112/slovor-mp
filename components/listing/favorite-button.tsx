'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'

interface FavoriteButtonProps {
  listingId: string
  initialIsFavorited?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  default: 'h-10 w-10 md:h-11 md:w-11',
  lg: 'h-14 w-14',
}

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  default: 'h-5 w-5',
  lg: 'h-7 w-7',
}

export function FavoriteButton({
  listingId,
  initialIsFavorited = false,
  className,
  size = 'default',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { locale } = useTranslation()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkFavoriteStatus = async () => {
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
    checkFavoriteStatus()
  }, [listingId, supabase])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    const previousState = isFavorited
    setIsFavorited(!previousState)
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsFavorited(previousState)
      setIsLoading(false)
      router.push(`/${locale}/auth/login`)
      return
    }

    try {
      if (previousState) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ listing_id: listingId, user_id: user.id })
        if (error && error.code !== '23505') throw error
      }
      router.refresh()
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setIsFavorited(previousState)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      className={cn(
        'group relative flex items-center justify-center rounded-xl transition-all duration-300 border border-white/20',
        sizeClasses[size],
        isFavorited
          ? 'bg-red-500 text-white shadow-md shadow-red-500/20 border-red-400'
          : 'bg-black/40 text-white backdrop-blur-none hover:bg-white hover:text-red-500 hover:border-white shadow-sm',
        className
      )}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFavorited ? 'favorited' : 'not-favorited'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <Heart
            className={cn(
              iconSizeClasses[size],
              'transition-colors duration-300',
              isFavorited && 'fill-current'
            )}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

