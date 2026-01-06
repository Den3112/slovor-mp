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
    actionLabel = "Back to Dashboard",
    actionLink = "/dashboard/overview"
}: DashboardFeaturePlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative bg-card p-6 rounded-[2rem] border border-border/50 shadow-2xl shadow-primary/10">
                    <Icon className="h-16 w-16 text-primary" />
                    <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border border-border">
                        <Construction className="h-5 w-5 text-amber-500" />
                    </div>
                </div>
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-4 text-center max-w-lg">
                {title} <span className="text-primary">Coming Soon</span>
            </h1>

            <p className="text-xl text-muted-foreground text-center max-w-lg mb-10 leading-relaxed">
                {description}
            </p>

            <Link href={actionLink}>
                <Button size="lg" className="rounded-2xl px-8 h-12 font-bold text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    {actionLabel}
                </Button>
            </Link>
        </div>
    )
}
