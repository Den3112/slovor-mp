'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { savedSearchesApi, type SavedSearch } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import {
    Bell,
    BellOff,
    Search,
    Trash2,
    ExternalLink,
    MapPin,
    Tag,
    Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SavedSearchesPage() {
    const { t } = useTranslation()
    const { user, isLoading: authLoading } = useAuth()
    const [searches, setSearches] = useState<SavedSearch[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        loadSearches()
    }, [user])

    const loadSearches = async () => {
        setIsLoading(true)
        const { data } = await savedSearchesApi.getAll()
        if (data) {
            setSearches(data)
        }
        setIsLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this saved search?')) return

        const { error } = await savedSearchesApi.delete(id)
        if (!error) {
            setSearches(prev => prev.filter(s => s.id !== id))
        }
    }

    const handleToggleNotifications = async (search: SavedSearch) => {
        const { data } = await savedSearchesApi.update(search.id, {
            notify_email: !search.notify_email,
        })
        if (data) {
            setSearches(prev => prev.map(s => s.id === data.id ? data : s))
        }
    }

    const buildSearchUrl = (search: SavedSearch) => {
        const params = new URLSearchParams()
        if (search.query) params.set('q', search.query)
        if (search.category_id) params.set('category', search.category_id)
        if (search.location) params.set('location', search.location)
        if (search.min_price) params.set('minPrice', search.min_price.toString())
        if (search.max_price) params.set('maxPrice', search.max_price.toString())
        return `/listings?${params.toString()}`
    }

    if (authLoading) {
        return (
            <Container className="py-20 pt-32">
                <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </Container>
        )
    }

    if (!user) {
        return (
            <Container className="py-20 pt-32">
                <div className="mx-auto max-w-md text-center">
                    <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                    <h1 className="mb-2 text-2xl font-bold">Saved Searches</h1>
                    <p className="mb-6 text-muted-foreground">
                        Sign in to view your saved searches
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground"
                    >
                        {t.auth.signIn}
                    </Link>
                </div>
            </Container>
        )
    }

    return (
        <div className="min-h-screen pb-20 pt-24 md:pt-32">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-black">Saved Searches</h1>
                    <p className="text-muted-foreground">
                        Get notified when new listings match your criteria
                    </p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-2xl bg-muted/30 p-6">
                                <div className="h-5 w-40 rounded bg-muted" />
                                <div className="mt-3 h-4 w-64 rounded bg-muted" />
                            </div>
                        ))}
                    </div>
                ) : searches.length === 0 ? (
                    <EmptyState
                        icon="🔍"
                        title="No saved searches"
                        description="Save a search to get notified when new listings match your criteria"
                    />
                ) : (
                    <div className="space-y-4">
                        {searches.map((search) => (
                            <div
                                key={search.id}
                                className="rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold">{search.name}</h3>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {search.query && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                                                    <Search className="h-3 w-3" />
                                                    {search.query}
                                                </span>
                                            )}
                                            {search.category?.name && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                                                    <Tag className="h-3 w-3" />
                                                    {search.category.name}
                                                </span>
                                            )}
                                            {search.location && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                                                    <MapPin className="h-3 w-3" />
                                                    {search.location}
                                                </span>
                                            )}
                                            {(search.min_price || search.max_price) && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                                                    €{search.min_price || 0} - €{search.max_price || '∞'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {search.frequency} notifications
                                            </span>
                                            <span>
                                                Created {new Date(search.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleNotifications(search)}
                                            className={cn(
                                                "rounded-xl",
                                                search.notify_email ? "text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            {search.notify_email ? (
                                                <Bell className="h-5 w-5" />
                                            ) : (
                                                <BellOff className="h-5 w-5" />
                                            )}
                                        </Button>

                                        <Link href={buildSearchUrl(search)}>
                                            <Button variant="ghost" size="sm" className="rounded-xl">
                                                <ExternalLink className="h-5 w-5" />
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(search.id)}
                                            className="rounded-xl text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}
