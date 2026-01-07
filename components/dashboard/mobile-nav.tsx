'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Store,
  Plus,
  MessageCircle,
  Menu
} from 'lucide-react'
import { MobileMenuDrawer } from './mobile-menu-drawer'

export function MobileBottomNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Glassmorphism Background with Gradient Border Top */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]" />

      <nav className="relative h-[88px] pb-[28px] px-2 flex items-center justify-around">
        {/* 1. Dashboard */}
        <Link
          href="/profile/overview"
          className={cn(
            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
            isActive('/profile/overview') ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutDashboard className={cn("h-6 w-6", isActive('/profile/overview') && "fill-primary/20")} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        {/* 2. My Listings */}
        <Link
          href="/profile/my-listings"
          className={cn(
            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
            isActive('/profile/my-listings') ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Store className={cn("h-6 w-6", isActive('/profile/my-listings') && "fill-primary/20")} />
          <span className="text-[10px] font-bold">Selling</span>
        </Link>

        {/* 3. CORE ACTION: POST AD */}
        <div className="relative -top-6">
          <Link href="/post">
            <div className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-white active:scale-95 transition-transform border-[3px] border-background">
              <Plus className="h-7 w-7 stroke-[3]" />
            </div>
          </Link>
        </div>

        {/* 4. Inbox */}
        <Link
          href="/profile/messages"
          className={cn(
            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
            isActive('/profile/messages') ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageCircle className={cn("h-6 w-6", isActive('/profile/messages') && "fill-primary/20")} />
          <span className="text-[10px] font-bold">Inbox</span>
        </Link>

        {/* 5. Menu Drawer Trigger */}
        <MobileMenuDrawer open={open} onOpenChange={setOpen}>
          <button
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95",
              open ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-bold">Menu</span>
          </button>
        </MobileMenuDrawer>
      </nav>
    </div>
  )
}
