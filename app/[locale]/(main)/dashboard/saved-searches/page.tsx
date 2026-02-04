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
import { Badge } from '@/components/ui/badge'
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
            {t('dashboard:savedSearches')}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
            {t('profile:savedSearchesDescription')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted/40 animate-pulse rounded-2xl border border-border/40 p-6 h-32"
            />
          ))}
        </div>
      ) : searches.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('profile:noSavedSearches')}
          description={t('profile:noSavedSearchesDesc')}
        />
      ) : (
        <div className="grid gap-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-black uppercase tracking-tight text-foreground truncate">{search.name}</h3>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/60">
                      {search.frequency}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {search.query && (
                      <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Search className="h-3 w-3" />
                        {search.query}
                      </span>
                    )}
                    {search.category?.name && (
                      <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Tag className="h-3 w-3" />
                        {search.category.name}
                      </span>
                    )}
                    {search.location && (
                      <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin className="h-3 w-3" />
                        {search.location}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <span className="flex items-center gap-1.5">
                      <Bell className="h-3 w-3" />
                      {search.notify_email ? 'Email ON' : 'Email OFF'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground/20" />
                      {new Date(search.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleNotifications(search)}
                    className={cn(
                      'h-10 w-10 rounded-xl transition-colors',
                      search.notify_email
                        ? 'bg-primary/5 text-primary hover:bg-primary/10'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'
                    )}
                  >
                    {search.notify_email ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </Button>

                  <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all">
                    <Link href={buildSearchUrl(search)}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(search.id)}
                    className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
