'use client'

import { useState } from 'react'
import Link from 'next/link'
import { savedSearchesApi, type SavedSearch } from '@/shared/lib/api'
import { useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
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
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
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
} from '@/shared/ui/alert-dialog'

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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 shadow-md">
        <div className="bg-primary/10 absolute -top-20 -right-20 h-64 w-64 animate-pulse rounded-full opacity-40 blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="bg-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
                {t('profile:savedSearchesDescription')}
              </p>
              <h1 className="text-foreground text-5xl font-black tracking-tighter uppercase sm:text-6xl">
                {t('dashboard:savedSearches')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="bg-card border-border flex flex-col items-center justify-center rounded-2xl border py-32 text-center shadow-md">
          <div className="bg-primary/5 border-primary/10 mb-8 flex h-24 w-24 items-center justify-center rounded-xl shadow-inner">
            <Search className="text-primary/30 h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-foreground text-3xl font-black tracking-tighter uppercase">
              {t('profile:noSavedSearches')}
            </h3>
            <p className="text-muted-foreground/60 mx-auto max-w-sm text-[10px] font-black tracking-[0.3em] uppercase">
              {t('profile:noSavedSearchesDesc')}
            </p>
          </div>
          <Button
            asChild
            className="group shadow-primary/20 bg-primary hover:bg-primary/90 relative h-16 rounded-xl px-10 text-xs font-black tracking-[0.2em] uppercase shadow-md transition-all duration-500 hover:scale-105 active:scale-95"
          >
            <Link href="/listings">{t('common:browseListings')}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {searches.map((search) => (
            <div
              key={search.id}
              className="bg-card group border-border hover:bg-primary/5 relative overflow-hidden rounded-2xl border p-8 shadow-md transition-all duration-500 hover:shadow-lg"
            >
              <div className="bg-primary/0 group-hover:bg-primary/40 absolute inset-y-0 left-0 w-1 transition-all" />

              <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex items-center gap-4">
                    <h3 className="text-foreground group-hover:text-primary truncate text-2xl font-black tracking-tighter uppercase transition-colors">
                      {search.name}
                    </h3>
                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-xl px-2.5 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm">
                      {search.frequency}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {search.query && (
                      <span className="bg-muted/30 text-muted-foreground/60 inline-flex items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase shadow-sm">
                        <Search className="h-3.5 w-3.5" />
                        {search.query}
                      </span>
                    )}
                    {search.category?.name && (
                      <span className="bg-muted/30 text-muted-foreground/60 inline-flex items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase shadow-sm">
                        <Tag className="h-3.5 w-3.5" />
                        {search.category.name}
                      </span>
                    )}
                    {search.location && (
                      <span className="bg-muted/30 text-muted-foreground/60 inline-flex items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase shadow-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        {search.location}
                      </span>
                    )}
                    {(search.min_price || search.max_price) && (
                      <span className="bg-muted/30 text-muted-foreground/60 inline-flex items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase shadow-sm">
                        €{search.min_price || 0} -{' '}
                        {search.max_price ? `€${search.max_price}` : '∞'}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center gap-6">
                    <button
                      onClick={() => handleToggleNotifications(search)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300',
                        search.notify_email
                          ? 'bg-primary/10 text-primary shadow-primary/5 shadow-lg'
                          : 'bg-muted/30 text-muted-foreground/40'
                      )}
                    >
                      {search.notify_email ? (
                        <Bell className="h-3.5 w-3.5" />
                      ) : (
                        <BellOff className="h-3.5 w-3.5" />
                      )}
                      {search.notify_email
                        ? t('dashboard:emailStatusOn')
                        : t('dashboard:emailStatusOff')}
                    </button>
                    <span className="text-muted-foreground/20 flex items-center gap-2.5 text-[10px] font-black tracking-[0.15em] uppercase">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(search.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-3 sm:flex-col lg:flex-row">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleNotifications(search)}
                    className={cn(
                      'h-14 w-14 rounded-2xl border transition-all duration-500',
                      search.notify_email
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10 shadow-md'
                        : 'bg-primary/5 text-muted-foreground/40 border-border hover:border-primary/20 hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    {search.notify_email ? (
                      <Bell className="h-6 w-6" />
                    ) : (
                      <BellOff className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="border-border hover:bg-primary/5 h-16 w-16 rounded-xl p-0 transition-all hover:scale-105"
                  >
                    <Link href={buildSearchUrl(search)}>
                      <ExternalLink className="h-6 w-6" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(search.id)}
                    disabled={isDeleting === search.id}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 border-border h-14 w-14 rounded-xl border shadow-md transition-all duration-500 hover:scale-110 active:scale-95"
                  >
                    {isDeleting === search.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-6 w-6" />
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
