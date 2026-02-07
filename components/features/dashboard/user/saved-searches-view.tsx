'use client'

import { useState } from 'react'
import Link from 'next/link'
import { savedSearchesApi, type SavedSearch } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
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
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SavedSearchesViewProps {
  initialSearches: SavedSearch[]
}

export function SavedSearchesView({ initialSearches }: SavedSearchesViewProps) {
  const { t } = useTranslation(['common', 'profile', 'dashboard'])
  const [searches, setSearches] = useState<SavedSearch[]>(initialSearches)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(deleteId)
    try {
      const { error } = await savedSearchesApi.delete(deleteId)
      if (error) throw new Error(error)

      setSearches((prev) => prev.filter((s) => s.id !== deleteId))
      toast.success(t('dashboard:deleted'))
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsDeleting(null)
      setDeleteId(null)
    }
  }

  const handleToggleNotifications = async (search: SavedSearch) => {
    try {
      const { data, error } = await savedSearchesApi.update(search.id, {
        notify_email: !search.notify_email,
      })
      if (error) throw new Error(error)

      if (data) {
        setSearches((prev) => prev.map((s) => (s.id === data.id ? data : s)))
        toast.success(
          data.notify_email
            ? t('dashboard:notificationsEnabled')
            : t('dashboard:notificationsDisabled')
        )
      }
    } catch (error) {
      toast.error((error as Error).message)
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="bg-card border-border flex flex-col justify-between gap-4 rounded-xl border p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
            {t('dashboard:savedSearches')}
          </h1>
          <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('profile:savedSearchesDescription')}
          </p>
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="bg-card border-border rounded-xl border p-12 shadow-sm">
          <EmptyState
            icon={Search}
            title={t('profile:noSavedSearches')}
            description={t('profile:noSavedSearchesDesc')}
            actionLabel={t('common:browseListings')}
            actionHref="/listings"
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-foreground truncate text-base font-bold tracking-tight uppercase">
                      {search.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-border/60 bg-muted/20 rounded text-[9px] font-bold tracking-widest uppercase"
                    >
                      {search.frequency}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {search.query && (
                      <span className="bg-muted/40 text-muted-foreground border-border/40 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                        <Search className="h-3 w-3" />
                        {search.query}
                      </span>
                    )}
                    {search.category?.name && (
                      <span className="bg-muted/40 text-muted-foreground border-border/40 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                        <Tag className="h-3 w-3" />
                        {search.category.name}
                      </span>
                    )}
                    {search.location && (
                      <span className="bg-muted/40 text-muted-foreground border-border/40 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                        <MapPin className="h-3 w-3" />
                        {search.location}
                      </span>
                    )}
                    {(search.min_price || search.max_price) && (
                      <span className="bg-muted/40 text-muted-foreground border-border/40 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                        €{search.min_price || 0} -{' '}
                        {search.max_price ? `€${search.max_price}` : '∞'}
                      </span>
                    )}
                  </div>

                  <div className="text-muted-foreground/50 mt-4 flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase">
                    <span
                      className={cn(
                        'flex items-center gap-1.5 rounded px-2 py-1 transition-colors',
                        search.notify_email
                          ? 'text-primary bg-primary/5'
                          : 'text-muted-foreground/40 bg-muted/40'
                      )}
                    >
                      {search.notify_email ? (
                        <Bell className="h-3 w-3" />
                      ) : (
                        <BellOff className="h-3 w-3" />
                      )}
                      {search.notify_email
                        ? t('dashboard:emailStatusOn')
                        : t('dashboard:emailStatusOff')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="text-muted-foreground/20 h-3 w-3" />
                      {new Date(search.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleNotifications(search)}
                    className={cn(
                      'h-11 w-11 rounded-xl border border-transparent transition-all',
                      search.notify_email
                        ? 'bg-primary/5 text-primary hover:bg-primary/10 border-primary/10'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted/60 border-border/40'
                    )}
                    title={
                      search.notify_email
                        ? t('dashboard:disableNotifications')
                        : t('dashboard:enableNotifications')
                    }
                  >
                    {search.notify_email ? (
                      <Bell className="h-4.5 w-4.5" />
                    ) : (
                      <BellOff className="h-4.5 w-4.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="bg-muted/40 hover:bg-primary/10 hover:text-primary border-border/40 h-11 w-11 rounded-xl border transition-all"
                  >
                    <Link href={buildSearchUrl(search)}>
                      <ExternalLink className="h-4.5 w-4.5" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(search.id)}
                    disabled={isDeleting === search.id}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground/20 hover:border-destructive/10 h-11 w-11 rounded-xl border border-transparent transition-all"
                  >
                    {isDeleting === search.id ? (
                      <Loader2 className="text-destructive h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4.5 w-4.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="border-border bg-card rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight uppercase">
              {t('profile:deleteSearchTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              {t('profile:deleteSearchConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl text-[10px] font-bold tracking-widest uppercase">
              {t('common:cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl text-[10px] font-bold tracking-widest uppercase"
            >
              {t('common:delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
