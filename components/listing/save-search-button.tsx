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
                frequency: 'daily'
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
                className="rounded-xl gap-2"
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
                <Button variant="outline" size="sm" className="rounded-xl gap-2">
                    <BookmarkPlus className="h-4 w-4" />
                    Save Search
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
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
                    <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-5 transition-colors hover:bg-muted/60">
                        <Label htmlFor="email-notif" className="flex flex-col gap-1 cursor-pointer">
                            <span className="text-base font-bold text-foreground">Email Notifications</span>
                            <span className="text-sm font-medium text-muted-foreground/80">
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
                        className="rounded-xl w-full"
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
