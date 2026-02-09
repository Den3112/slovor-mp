'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Ban,
  MoreHorizontal,
} from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { profilesApi, adminApi, type User } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Sub-components
import { UsersHeader } from './users-header'

interface AdminUsersViewProps {
  initialUsers?: User[]
}

export function AdminUsersView({ initialUsers = [] }: AdminUsersViewProps) {
  const { t } = useTranslation(['common', 'admin', 'users'])
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isLoading, setIsLoading] = useState(initialUsers.length === 0)
  const [searchQuery, setSearchQuery] = useState('')

  // Sorting state
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    const { data } = await profilesApi.getAdminAll()
    if (data) setUsers(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (initialUsers.length === 0) {
      loadUsers()
    }
  }, [initialUsers.length, loadUsers])

  const handleToggleVerification = async (user: User) => {
    const newStatus = !user.is_verified
    const { error } = await profilesApi.update(user.id, {
      is_verified: newStatus,
    })
    if (error) {
      toast.error(error)
    } else {
      toast.success(newStatus ? t('admin:userVerified') : t('admin:verificationRemoved'))
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_verified: newStatus } : u
        )
      )
      if (newStatus) {
        adminApi.logAction({
          target_id: user.id,
          target_type: 'user',
          action_type: 'verify',
          reason: 'Admin manual verification',
        })
      }
    }
  }

  const handleToggleBan = async (user: User) => {
    const isBanned = user.status === 'banned'
    const newStatus = isBanned ? 'active' : 'banned'
    const { error } = await profilesApi.update(user.id, {
      status: newStatus as any,
    })
    if (error) {
      toast.error(error)
    } else {
      toast.success(isBanned ? t('admin:userUnbanned') : t('admin:userBanned'))
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      )
      if (newStatus === 'banned') {
        adminApi.logAction({
          target_id: user.id,
          target_type: 'user',
          action_type: 'ban',
          reason: 'Admin manual ban',
        })
      }
    }
  }

  const handleRoleChange = async (
    user: User,
    newRole: 'user' | 'admin' | 'moderator'
  ) => {
    const { error } = await profilesApi.update(user.id, { role: newRole })
    if (error) {
      toast.error(error)
    } else {
      toast.success(`${t('admin:roleUpdated')} ${newRole}`)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      )
    }
  }

  const filteredUsers = useMemo(() => {
    let result = users

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (u) =>
          (u.display_name?.toLowerCase() || '').includes(q) ||
          u.id.toLowerCase().includes(q)
      )
    }

    return result.sort((a, b) => {
      const aValue = a[sortColumn as keyof User] || ''
      const bValue = b[sortColumn as keyof User] || ''

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      return sortDirection === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1
    })
  }, [users, searchQuery, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const columns: Column<User>[] = [
    {
      key: 'display_name',
      header: t('admin:tableMember'),
      sortable: true,
      className: 'min-w-[250px]',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted border-border/40 relative h-10 w-10 shrink-0 overflow-hidden rounded-full border shadow-sm">
            {row.avatar_url ? (
              <Image
                src={row.avatar_url}
                alt={row.display_name || ''}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="text-muted-foreground/30 flex h-full w-full items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-foreground mb-1 max-w-[150px] truncate text-sm leading-none font-bold tracking-tight">
              {row.display_name || t('admin:anonymous')}
            </span>
            <span className="text-muted-foreground/60 font-mono text-[9px] leading-none font-bold tracking-tighter uppercase opacity-80">
              ID: {row.id.split('-')[0]}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: t('admin:tableJoined'),
      sortable: true,
      className: 'hidden md:table-cell',
      cell: (row) => (
        <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : t('admin:na')}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('admin:tableStatus'),
      cell: (row: any) => {
        const status = row.status || 'active'
        return (
          <Badge
            variant="outline"
            className={cn(
              "flex h-6 w-fit items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase",
              status === 'active' ? "bg-success/10 text-success border-success/20" :
                status === 'pending' ? "bg-warning/10 text-warning border-warning/20" :
                  "bg-destructive/10 text-destructive border-destructive/20"
            )}
          >
            <span className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              status === 'active' ? "bg-success" :
                status === 'pending' ? "bg-warning" :
                  "bg-destructive"
            )} />
            {t(`admin:status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
          </Badge>
        )
      },
    },
    {
      key: 'role',
      header: t('admin:tableRole'),
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-primary h-auto justify-start p-0 text-[10px] font-bold tracking-widest uppercase hover:bg-transparent"
              >
                {row.role || 'user'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="border-border/60 bg-background/95 backdrop-blur-xl">
              <DropdownMenuLabel className="text-[10px] font-bold tracking-widest uppercase opacity-60">{t('admin:changeRole')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleRoleChange(row, 'user')} className="text-[10px] font-bold tracking-widest uppercase">
                {t('admin:roleUser')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange(row, 'moderator')}
                className="text-[10px] font-bold tracking-widest uppercase"
              >
                {t('admin:roleModerator')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange(row, 'admin')} className="text-[10px] font-bold tracking-widest uppercase">
                {t('admin:roleAdmin')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-muted-foreground/40 text-[9px] font-bold tracking-widest uppercase">
            LVL: {row.verification_level || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'verification',
      header: t('admin:tableVerification'),
      sortable: true,
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.is_verified ? (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 rounded-sm px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            >
              <ShieldCheck className="mr-1 h-3 w-3" />
              {t('admin:verified')}
            </Badge>
          ) : (
            <span className="text-muted-foreground/30 text-[9px] font-bold tracking-widest uppercase italic">
              {t('admin:unverified')}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50 h-8 w-8 rounded-lg"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border/60 bg-background/95 backdrop-blur-xl">
              <DropdownMenuLabel className="text-[10px] font-bold tracking-widest uppercase opacity-60">{t('admin:actions')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleToggleVerification(row)} className="text-[10px] font-bold tracking-widest uppercase">
                {row.is_verified ? (
                  <>
                    <ShieldAlert className="mr-2 h-3.5 w-3.5 text-warning" />
                    {t('admin:removeVerification')}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-3.5 w-3.5 text-success" />
                    {t('admin:verifyUser')}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleToggleBan(row)}
                className="text-destructive focus:text-destructive focus:bg-destructive/5 text-[10px] font-bold tracking-widest uppercase"
              >
                <Ban className="mr-2 h-3.5 w-3.5" />
                {row.status === 'banned' ? t('admin:unbanUser') : t('admin:banUser')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
      data-testid="admin-users-view"
    >
      <UsersHeader />

      <DataGrid
        columns={columns}
        data={filteredUsers}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSearch={setSearchQuery}
        searchPlaceholder={t('admin:searchUsers')}
        isLoading={isLoading}
        emptyMessage={t('admin:noUsersFound')}
      />
    </motion.div>
  )
}
