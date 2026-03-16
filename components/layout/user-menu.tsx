'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Heart,
  Store,
  Eye,
  ShieldAlert,
} from 'lucide-react'
import { config } from '@/lib/config'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

interface UserMenuProps {
  user: SupabaseUser
  signOut: () => void
}

export function UserMenu({ user, signOut }: UserMenuProps) {
  const { t, locale } = useTranslation(['common', 'profile', 'auth'])
  const unreadCount = useUnreadMessages()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
        aria-label="User menu"
        aria-expanded={showUserMenu}
        className="group relative flex items-center gap-2"
      >
        <div className="from-primary shadow-primary/10 h-9 w-9 rounded-xl bg-linear-to-tr via-violet-500 to-indigo-500 p-[1.5px] shadow-lg transition-transform group-hover:scale-105">
          <div className="border-primary/10 bg-card text-primary relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border font-bold">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="User avatar"
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span aria-hidden="true">{user.email?.[0]?.toUpperCase()}</span>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="bg-primary ring-background absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-md text-[10px] font-bold text-white ring-2">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="shadow-premium border-border bg-card/95 absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-xl border"
          >
            <div className="border-border/50 bg-muted/30 border-b px-5 py-4">
              <p className="text-primary mb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('auth:signedInAs')}
              </p>
              <p className="text-foreground truncate text-sm font-bold">
                {user.email}
              </p>
            </div>
            <div className="space-y-0.5 p-2">
              {config.app.adminEmails.includes(user.email || '') && (
                <Link
                  href={`/${locale}/admin`}
                  className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-amber-500 transition-all hover:translate-x-1 hover:bg-amber-500/10 hover:text-amber-600 active:scale-95"
                  onClick={() => setShowUserMenu(false)}
                >
                  <ShieldAlert className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {t('common:adminPanel')}
                </Link>
              )}

              <Link
                href={`/${locale}/dashboard`}
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:translate-x-1 active:scale-95"
                onClick={() => setShowUserMenu(false)}
              >
                <LayoutDashboard className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t('common:dashboard')}
              </Link>

              <Link
                href={`/${locale}/dashboard/listings`}
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:translate-x-1 active:scale-95"
                onClick={() => setShowUserMenu(false)}
              >
                <Store className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t('profile:myListings')}
              </Link>

              <Link
                href={`/${locale}/dashboard/favorites`}
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:translate-x-1 active:scale-95"
                onClick={() => setShowUserMenu(false)}
              >
                <Heart className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t('profile:favorites')}
              </Link>

              <Link
                href={`/${locale}/dashboard/saved-searches`}
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:translate-x-1 active:scale-95"
                onClick={() => setShowUserMenu(false)}
              >
                <LayoutDashboard className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t('profile:savedSearches')}
              </Link>

              <div className="bg-border/50 mx-2 my-1 h-px" />

              <Link
                href={`/${locale}/dashboard/profile`}
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:translate-x-1 active:scale-95"
                onClick={() => setShowUserMenu(false)}
              >
                <Eye className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t('profile:publicProfile')}
              </Link>

              <Link
                href={`/${locale}/dashboard/settings`}
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:translate-x-1 active:scale-95"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t('profile:settings')}
              </Link>

              <div className="bg-border/50 mx-2 my-1 h-px" />

              <button
                onClick={() => signOut()}
                className="text-destructive hover:bg-destructive/5 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                {t('auth:signOut')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
