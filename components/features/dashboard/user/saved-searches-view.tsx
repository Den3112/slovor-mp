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
    Loader2
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
            toast.success(t('dashboard:deleted') || 'Search deleted')
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
                toast.success(data.notify_email ? 'Notifications enabled' : 'Notifications disabled')
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-xl shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
                        {t('dashboard:savedSearches')}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('profile:savedSearchesDescription')}
                    </p>
                </div>
            </div>

            {searches.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 shadow-sm">
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
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-base font-black uppercase tracking-tight text-foreground truncate">{search.name}</h3>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/60 bg-muted/20">
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
                                        {(search.min_price || search.max_price) && (
                                            <span className="bg-muted/40 text-muted-foreground border border-border/40 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                                                €{search.min_price || 0} - {search.max_price ? `€${search.max_price}` : '∞'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
                                            search.notify_email ? "text-primary bg-primary/5" : "text-muted-foreground/40 bg-muted/40"
                                        )}>
                                            {search.notify_email ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
                                            Email: {search.notify_email ? 'ON' : 'OFF'}
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
                                            'h-11 w-11 rounded-xl transition-all border border-transparent',
                                            search.notify_email
                                                ? 'bg-primary/5 text-primary hover:bg-primary/10 border-primary/10'
                                                : 'bg-muted/40 text-muted-foreground hover:bg-muted/60 border-border/40'
                                        )}
                                        title={search.notify_email ? 'Disable notifications' : 'Enable notifications'}
                                    >
                                        {search.notify_email ? (
                                            <Bell className="h-4.5 w-4.5" />
                                        ) : (
                                            <BellOff className="h-4.5 w-4.5" />
                                        )}
                                    </Button>

                                    <Button variant="ghost" size="icon" asChild className="h-11 w-11 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary border border-border/40 transition-all">
                                        <Link href={buildSearchUrl(search)}>
                                            <ExternalLink className="h-4.5 w-4.5" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeleteId(search.id)}
                                        disabled={isDeleting === search.id}
                                        className="h-11 w-11 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground/20 border border-transparent hover:border-destructive/10 transition-all"
                                    >
                                        {isDeleting === search.id ? <Loader2 className="h-4 w-4 animate-spin text-destructive" /> : <Trash2 className="h-4.5 w-4.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-xl border-border bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">
                            {t('profile:deleteSearchTitle') || 'Delete Saved Search'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground font-medium">
                            {t('profile:deleteSearchConfirm') || 'Are you sure you want to delete this saved search? This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl font-black uppercase tracking-widest text-[10px]">
                            {t('common:cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black uppercase tracking-widest text-[10px]"
                        >
                            {t('common:delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
