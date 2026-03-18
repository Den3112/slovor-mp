'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useFavorites(userId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [localFavorites, setLocalFavorites] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('slovor_favorites')
    if (saved) {
      setLocalFavorites(JSON.parse(saved))
    }
  }, [])

  // Fetch from Supabase if user is logged in
  const { data: dbFavorites = [] } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', userId)

      if (error) throw error
      return data.map((f) => f.listing_id)
    },
    enabled: !!userId,
  })

  // Sync logic
  const favorites = userId ? dbFavorites : localFavorites

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const isFavorite = favorites.includes(listingId)

      if (userId) {
        if (isFavorite) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({ user_id: userId, listing_id: listingId })
          if (error) throw error
        }
      } else {
        const newLocal = isFavorite
          ? localFavorites.filter((id) => id !== listingId)
          : [...localFavorites, listingId]

        localStorage.setItem('slovor_favorites', JSON.stringify(newLocal))
        setLocalFavorites(newLocal)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
    onError: () => {
      toast.error('Nepodarilo sa aktualizovať obľúbené')
    },
  })

  const isFavorite = useCallback(
    (listingId: string) => favorites.includes(listingId),
    [favorites]
  )

  return {
    favorites,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isFavorite,
    isLoading: toggleFavoriteMutation.isPending,
  }
}
