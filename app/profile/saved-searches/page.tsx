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
    if (!confirm(t.profile.deleteSearchConfirm)) return

    const { error } = await savedSearchesApi.delete(id)
    if (!error) {
      setSearches((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const handleToggleNotifications = async (search: SavedSearch) => {
    const { data } = await savedSearchesApi.update(search.id, {
      notify_email: !search.notify_email,
    })
    if (data) {
      setSearches((prev) => prev.map((s) => (s.id === data.id ? data : s)))
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
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container className="py-20 pt-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold">{t.dashboard.savedSearches}</h1>
          <p className="text-muted-foreground mb-6">
            {t.auth.signInToViewSearches}
          </p>
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground inline-block rounded-xl px-6 py-3 font-bold"
          >
            {t.auth.signIn}
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-32">
      <Container>
        <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10">
            <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
              {t.dashboard.savedSearches}
            </h1>
            <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
              {t.profile.savedSearchesDescription}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-muted/30 animate-pulse rounded-2xl p-6"
              >
                <div className="bg-muted h-5 w-40 rounded" />
                <div className="bg-muted mt-3 h-4 w-64 rounded" />
              </div>
            ))}
          </div>
        ) : searches.length === 0 ? (
          <div className="rounded-5xl border border-white/10 bg-white/5 p-8 shadow-inner backdrop-blur-md md:p-12">
            <EmptyState
              icon={Search}
              title={t.profile.noSavedSearches}
              description={t.profile.noSavedSearchesDesc}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => (
              <div
                key={search.id}
                className="border-border/50 bg-card hover:border-primary/30 rounded-2xl border p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{search.name}</h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {search.query && (
                        <span className="bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                          <Search className="h-3 w-3" />
                          {search.query}
                        </span>
                      )}
                      {search.category?.name && (
                        <span className="bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                          <Tag className="h-3 w-3" />
                          {search.category.name}
                        </span>
                      )}
                      {search.location && (
                        <span className="bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {search.location}
                        </span>
                      )}
                      {(search.min_price || search.max_price) && (
                        <span className="bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                          €{search.min_price || 0} - €{search.max_price || '∞'}
                        </span>
                      )}
                    </div>

                    <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {search.frequency} {t.profile.notifications}
                      </span>
                      <span>
                        {t.profile.created}{' '}
                        {new Date(search.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleNotifications(search)}
                      className={cn(
                        'rounded-xl',
                        search.notify_email
                          ? 'text-primary'
                          : 'text-muted-foreground'
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
                      className="text-destructive hover:bg-destructive/10 rounded-xl"
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
