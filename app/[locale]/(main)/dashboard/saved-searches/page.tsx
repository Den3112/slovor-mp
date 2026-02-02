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
    if (!confirm(t('profile.deleteSearchConfirm'))) return

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
          <h1 className="mb-2 text-2xl font-bold">{t('dashboard.savedSearches')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('auth.signInToViewSearches')}
          </p>
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground inline-block rounded-xl px-6 py-3 font-bold"
          >
            {t('auth.signIn')}
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-32">
      <Container>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm md:p-10">
          <div className="relative z-10 space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
              {t('dashboard:savedSearches')}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t('profile:savedSearchesDescription')}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-muted/40 animate-pulse rounded-xl border border-border/40 p-6 h-32"
              />
            ))}
          </div>
        ) : searches.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm md:p-12">
            <EmptyState
              icon={Search}
              title={t('profile:noSavedSearches')}
              description={t('profile:noSavedSearchesDesc')}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.id}
                className="border-border bg-card hover:border-primary/30 rounded-xl border p-6 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black uppercase tracking-tight text-foreground truncate">{search.name}</h3>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {search.query && (
                        <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                          <Search className="h-2.5 w-2.5" />
                          {search.query}
                        </span>
                      )}
                      {search.category?.name && (
                        <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                          <Tag className="h-2.5 w-2.5" />
                          {search.category.name}
                        </span>
                      )}
                      {search.location && (
                        <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                          <MapPin className="h-2.5 w-2.5" />
                          {search.location}
                        </span>
                      )}
                      {(search.min_price || search.max_price) && (
                        <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                          €{search.min_price || 0} - €{search.max_price || '∞'}
                        </span>
                      )}
                    </div>

                    <div className="text-muted-foreground/50 mt-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
                      <span className="inline-flex items-center gap-1 text-primary/70">
                        <Bell className="h-2.5 w-2.5" />
                        {search.frequency} {t('profile:notifications')}
                      </span>
                      <span>
                        {t('profile:created')} {new Date(search.created_at).toLocaleDateString()}
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
