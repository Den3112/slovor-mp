'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { savedSearchesApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BookmarkPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n'
import type { ListingFilterOptions } from '@/lib/api/listings'

interface Props {
  filters: ListingFilterOptions
  searchQuery?: string
}

export function SaveSearchButton({ filters, searchQuery }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const { t, locale } = useTranslation(['dashboard', 'common'])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [notifyEmail, setNotifyEmail] = useState(true)

  const handleSave = async () => {
    if (!user) {
      router.push(`/${locale}/auth/login`)
      return
    }

    if (!name.trim()) return

    setLoading(true)
    try {
      const { error } = await savedSearchesApi.create({
        name: name.trim(),
        query: searchQuery,
        category_id: filters.categoryId,
        location: filters.location,
        min_price: filters.priceMin,
        max_price: filters.priceMax,
        notify_email: notifyEmail,
        frequency: 'daily',
      })

      if (error) throw new Error(error)

      toast.success(t('dashboard:savedSearchesDetails.success'))
      setOpen(false)
      setName('')
    } catch (error) {
      toast.error(t('dashboard:savedSearchesDetails.error'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 rounded-xl"
        onClick={() => router.push(`/${locale}/auth/login`)}
      >
        <BookmarkPlus className="h-4 w-4" />
        {t('dashboard:savedSearchesDetails.saveButton')}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <BookmarkPlus className="h-4 w-4" />
          {t('dashboard:savedSearchesDetails.saveButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('dashboard:savedSearchesDetails.title')}</DialogTitle>
          <DialogDescription>
            {t('dashboard:savedSearchesDetails.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              {t('dashboard:savedSearchesDetails.nameLabel')}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('dashboard:savedSearchesDetails.namePlaceholder')}
              className="rounded-xl"
            />
          </div>
          <div className="bg-muted/40 hover:bg-muted/60 flex items-center justify-between rounded-xl p-5 transition-colors">
            <Label
              htmlFor="email-notif"
              className="flex cursor-pointer flex-col gap-1"
            >
              <span className="text-foreground text-base font-bold">
                {t('dashboard:savedSearchesDetails.emailNotifications')}
              </span>
              <span className="text-muted-foreground/80 text-sm font-medium">
                {t('dashboard:savedSearchesDetails.emailNotificationsDesc')}
              </span>
            </Label>
            <Switch
              id="email-notif"
              checked={notifyEmail}
              onCheckedChange={setNotifyEmail}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || loading}
            className="w-full rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('dashboard:savedSearchesDetails.saving')}
              </>
            ) : (
              t('dashboard:savedSearchesDetails.saveButton')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
