'use client'

import { type LucideIcon, Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardFeaturePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  actionLabel?: string
  actionLink?: string
}

export function DashboardFeaturePlaceholder({
  title,
  description,
  icon: Icon,
  actionLabel = 'Back to Dashboard',
  actionLink = '/dashboard',
}: DashboardFeaturePlaceholderProps) {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[60vh] flex-col items-center justify-center duration-500">
      <div className="relative mb-8">
        <div className="bg-primary/20 absolute inset-0 rounded-full blur-3xl" />
        <div className="bg-card border-border/50 shadow-primary/10 relative rounded-4xl border p-6 shadow-2xl">
          <Icon className="text-primary h-16 w-16" />
          <div className="bg-background border-border absolute -right-2 -bottom-2 rounded-full border p-1.5">
            <Construction className="h-5 w-5 text-amber-500" />
          </div>
        </div>
      </div>

      <h1 className="mb-4 max-w-lg text-center text-4xl font-black tracking-tight">
        {title} <span className="text-primary">Coming Soon</span>
      </h1>

      <p className="text-muted-foreground mb-10 max-w-lg text-center text-xl leading-relaxed">
        {description}
      </p>

      <Link href={actionLink}>
        <Button
          size="lg"
          className="shadow-primary/20 h-12 rounded-2xl px-8 text-base font-bold shadow-lg transition-transform hover:scale-105"
        >
          {actionLabel}
        </Button>
      </Link>
    </div>
  )
}
