'use client'

import { useState, useEffect } from 'react'
import { favoritesApi } from '@/lib/api'

interface UseFavoriteProps {
    listingId: string
    userId?: string
}

export function useFavorite({ listingId, userId }: UseFavoriteProps) {
    const [isFavorited, setIsFavorited] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!userId) return
        favoritesApi.isFavorited(listingId, userId).then((res) => {
            if (res.data !== null) {
                setIsFavorited(res.data)
            }
        })
    }, [userId, listingId])

    const toggleFavorite = async () => {
        if (!userId) {
            window.location.href = '/auth/login'
            return
        }

        setIsLoading(true)
        const { data, error } = await favoritesApi.toggle(listingId, userId)
        if (!error && data) {
            setIsFavorited(data.isFavorited)
        }
        setIsLoading(false)
    }

    return { isFavorited, isLoading, toggleFavorite }
}
