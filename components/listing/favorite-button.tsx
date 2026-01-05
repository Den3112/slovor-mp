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
}

export function FavoriteButton({ listingId, initialIsFavorited = false, className }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Fetch actual state on mount if not provided (or to verify)
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('favorites')
                .select('id')
                .eq('listing_id', listingId)
                .eq('user_id', user.id)
                .single()

            if (data) setIsFavorited(true)
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

        const { data: { user } } = await supabase.auth.getUser()

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

                if (error) throw error
            }

            router.refresh()
        } catch (error) {
            console.error('Error toggling favorite:', error)
            setIsFavorited(previousState) // Revert
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={toggleFavorite}
            className={cn(
                "group/fav relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90",
                isFavorited
                    ? "bg-red-500 text-white shadow-red-500/30 hover:bg-red-600"
                    : "bg-black/20 text-white/80 backdrop-blur-md hover:bg-white hover:text-red-500 hover:shadow-lg",
                className
            )}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isFavorited && "fill-current scale-110",
                    isLoading && "opacity-50"
                )}
            />
        </button>
    )
}
