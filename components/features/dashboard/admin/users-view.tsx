'use client'

import React, { useState, useMemo } from 'react'
import {
    Users, ShieldCheck, ShieldAlert, Ban,
    MoreHorizontal
} from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { usersApi, adminApi, type User } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminUsersViewProps {
    initialUsers?: User[]
}

export function AdminUsersView({ initialUsers = [] }: AdminUsersViewProps) {
    const { t } = useTranslation('common')
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [isLoading, setIsLoading] = useState(initialUsers.length === 0)
    const [searchQuery, setSearchQuery] = useState('')

    // Sorting state
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    React.useEffect(() => {
        if (initialUsers.length === 0) {
            loadUsers()
        }
    }, [initialUsers.length])

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
            toast.success(newStatus ? t('admin.userVerified') : t('admin.verificationRemoved'))
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_verified: newStatus } : u))
            if (newStatus) {
                adminApi.logAction({
                    target_id: user.id,
                    target_type: 'user',
                    action_type: 'verify',
                    reason: 'Admin manual verification'
                })
            }
        }
    }

    const handleToggleBan = async (user: User) => {
        const isBanned = user.status === 'banned'
        const newStatus = isBanned ? 'active' : 'banned'
        const { error } = await usersApi.update(user.id, { status: newStatus as any })
        if (error) {
            toast.error(error)
        } else {
            toast.success(isBanned ? t('admin.userUnbanned') : t('admin.userBanned'))
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
            if (newStatus === 'banned') {
                adminApi.logAction({
                    target_id: user.id,
                    target_type: 'user',
                    action_type: 'ban',
                    reason: 'Admin manual ban'
                })
            }
        }
    }

    const handleRoleChange = async (user: User, newRole: 'user' | 'admin' | 'moderator') => {
        const { error } = await usersApi.update(user.id, { role: newRole })
        if (error) {
            toast.error(error)
        } else {
            toast.success(`${t('admin.roleUpdated')} ${newRole}`)
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
        }
    }

    // Filter & Sort
    const filteredUsers = useMemo(() => {
        let result = users

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(u =>
                (u.display_name?.toLowerCase() || '').includes(q) ||
                u.id.toLowerCase().includes(q)
            )
        }

        // Sort
        return result.sort((a, b) => {
            const aValue = a[sortColumn as keyof User] || ''
            const bValue = b[sortColumn as keyof User] || ''

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1)
        })
    }, [users, searchQuery, sortColumn, sortDirection])

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('desc')
        }
    }

    // Columns
    const columns: Column<User>[] = [
        {
            key: 'display_name',
            header: t('admin.tableMember'),
            sortable: true,
            className: "min-w-[250px]",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted border border-border">
                        {row.avatar_url ? (
                            <Image src={row.avatar_url} alt={row.display_name || ''} fill sizes="40px" className="object-cover" unoptimized />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Users className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight text-foreground truncate max-w-[150px] leading-none mb-1">
                            {row.display_name || t('admin.anonymous')}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">
                            ID: {row.id.split('-')[0]}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'created_at',
            header: t('admin.tableJoined'),
            sortable: true,
            cell: (row) => (
                <span className="text-sm font-medium text-muted-foreground">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
                </span>
            )
        },
        {
            key: 'role',
            header: t('admin.tableRoleLevel'),
            sortable: true,
            cell: (row) => (
                <div className="flex flex-col gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent justify-start font-bold uppercase text-xs tracking-wider text-primary">
                                {row.role || 'user'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRoleChange(row, 'user')}>User</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(row, 'moderator')}>Moderator</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(row, 'admin')}>Admin</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="text-[10px] text-muted-foreground/60">Level: {row.verification_level || t('admin.none')}</span>
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin.tableStatus'),
            sortable: true,
            cell: (row) => (
                <div className="flex flex-wrap gap-2">
                    {row.is_verified && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                            {t('admin.verified')}
                        </Badge>
                    )}
                    {row.status === 'banned' ? (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                            {t('admin.banned')}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground/40 border-border/40 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                            Active
                        </Badge>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            header: <span className="sr-only">{t('admin.tableActions')}</span>,
            className: "text-right",
            cell: (row) => (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleToggleVerification(row)}>
                                {row.is_verified ? (
                                    <>
                                        <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                                        {t('admin.removeVerification')}
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                                        {t('admin.verifyUser')}
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleBan(row)} className="text-destructive focus:text-destructive">
                                <Ban className="mr-2 h-4 w-4" />
                                {row.status === 'banned' ? t('admin.unbanUser') : t('admin.banUser')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6" data-testid="admin-users-view">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        {t('admin.userManagement')}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('admin.manageMembersTrust')}
                    </p>
                </div>
            </div>

            {/* Data Grid */}
            <DataGrid
                columns={columns}
                data={filteredUsers}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSearch={setSearchQuery}
                searchPlaceholder={t('admin.searchByNamesID')}
                isLoading={isLoading}
                emptyMessage="No users found."
            />
        </div>
    )
}
