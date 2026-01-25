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
import type { ListingFilterOptions } from '@/lib/api/listings'

interface Props {
  filters: ListingFilterOptions
  searchQuery?: string
}

export function SaveSearchButton({ filters, searchQuery }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [notifyEmail, setNotifyEmail] = useState(true)

  const handleSave = async () => {
    if (!user) {
      router.push('/auth/login')
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

      toast.success('Search saved successfully')
      setOpen(false)
      setName('')
    } catch (error) {
      toast.error('Failed to save search')
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
        onClick={() => router.push('/auth/login')}
      >
        <BookmarkPlus className="h-4 w-4" />
        Save Search
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <BookmarkPlus className="h-4 w-4" />
          Save Search
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save this search</DialogTitle>
          <DialogDescription>
            Get notified when new listings match your criteria.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 15 Pro Max"
              className="rounded-xl"
            />
          </div>
          <div className="bg-muted/40 hover:bg-muted/60 flex items-center justify-between rounded-2xl p-5 transition-colors">
            <Label
              htmlFor="email-notif"
              className="flex cursor-pointer flex-col gap-1"
            >
              <span className="text-foreground text-base font-bold">
                Email Notifications
              </span>
              <span className="text-muted-foreground/80 text-sm font-medium">
                Receive daily updates about new items
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
                Saving...
              </>
            ) : (
              'Save Search'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
