'use client'

import { useEffect, useState } from 'react'
import { usersApi, type User } from '@/lib/api'
import {
    ShieldCheck,
    ShieldAlert,
    Search,
    Loader2,
    User as UserIcon,
    Ban,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setIsLoading(true)
        const { data } = await usersApi.getAdminAll()
        if (data) setUsers(data)
        setIsLoading(false)
    }

    const handleToggleVerification = async (user: User) => {
        const newStatus = !user.is_verified
        const { error } = await usersApi.update(user.id, { is_verified: newStatus })
        if (error) {
            toast.error(error)
        } else {
            toast.success(newStatus ? 'User verified' : 'Verification removed')
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_verified: newStatus } : u))
        }
    }

    const filteredUsers = users.filter(u =>
        u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="font-heading text-4xl font-black tracking-tight italic">User Management</h1>
                    <p className="text-muted-foreground font-medium">Manage members and their trust levels.</p>
                </div>
                <div className="relative w-full max-w-sm md:w-80">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-border/50 bg-card w-full rounded-2xl border py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="border-border/50 bg-card overflow-hidden rounded-4xl border shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Member</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Role/Level</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-muted-foreground uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                                                {user.avatar_url ? (
                                                    <Image src={user.avatar_url} alt={user.display_name || ''} fill className="object-cover" />
                                                ) : (
                                                    <UserIcon className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <p className="font-bold text-foreground">
                                                    {user.display_name || 'Anonymous'}
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground truncate max-w-[200px]">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-muted-foreground">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-6 font-bold text-xs">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-primary uppercase tracking-widest">{user.role || 'User'}</span>
                                            <span className="text-muted-foreground/60">Level: {user.verification_level || 'None'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                                            user.is_verified ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                        )}>
                                            {user.is_verified ? 'Verified' : 'Unverified'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleVerification(user)}
                                                className={cn(
                                                    "rounded-xl",
                                                    user.is_verified ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                                                )}
                                                title={user.is_verified ? "Remove Verification" : "Verify User"}
                                            >
                                                {user.is_verified ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10 rounded-xl"
                                                title="Ban User"
                                            >
                                                <Ban className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
