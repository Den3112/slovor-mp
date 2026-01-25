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
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

interface UserMenuProps {
  user: SupabaseUser
  signOut: () => void
}

export function UserMenu({ user, signOut }: UserMenuProps) {
  const { t } = useTranslation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
        aria-label="User menu"
        aria-expanded={showUserMenu}
        className="group flex items-center gap-2"
      >
        <div className="from-primary shadow-primary/10 h-9 w-9 rounded-full bg-linear-to-tr via-violet-500 to-indigo-500 p-[1.5px] shadow-lg transition-transform group-hover:scale-105">
          <div className="border-primary/10 bg-card text-primary relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border font-black">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="User avatar"
                fill
                className="object-cover"
              />
            ) : (
              <span aria-hidden="true">{user.email?.[0]?.toUpperCase()}</span>
            )}
          </div>
        </div>
      </button>
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="shadow-premium border-border bg-card/95 absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-2xl border backdrop-blur-2xl"
          >
            <div className="border-border/50 bg-muted/30 border-b px-5 py-4">
              <p className="text-primary mb-1 text-[10px] font-black tracking-[0.2em] uppercase">
                {t.auth.signedInAs}
              </p>
              <p className="text-foreground truncate text-sm font-bold">
                {user.email}
              </p>
            </div>
            <div className="space-y-0.5 p-2">
              <Link
                href="/profile/overview"
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                onClick={() => setShowUserMenu(false)}
              >
                <LayoutDashboard className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                {t.common.dashboard}
              </Link>

              <Link
                href="/profile/my-listings"
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                onClick={() => setShowUserMenu(false)}
              >
                <Store className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                My Listings
              </Link>

              <Link
                href="/profile/favorites"
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                onClick={() => setShowUserMenu(false)}
              >
                <Heart className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                Favorites
              </Link>

              <Link
                href="/profile/saved-searches"
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                onClick={() => setShowUserMenu(false)}
              >
                <LayoutDashboard className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                Saved Searches
              </Link>

              <div className="bg-border/50 mx-2 my-1 h-px" />

              <Link
                href="/profile/profile"
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                onClick={() => setShowUserMenu(false)}
              >
                <Eye className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                Public Profile
              </Link>

              <Link
                href="/profile/settings"
                className="group text-foreground hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:scale-110" />
                Settings
              </Link>

              <div className="bg-border/50 mx-2 my-1 h-px" />

              <button
                onClick={() => signOut()}
                className="text-destructive hover:bg-destructive/5 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
              >
                <LogOut className="h-4 w-4" />
                {t.auth.signOut}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
