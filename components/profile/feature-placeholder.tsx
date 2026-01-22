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
    actionLink = "/profile/overview"
}: DashboardFeaturePlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-primary/20 blur-3xl" />
                <div className="relative bg-zinc-950 p-10 border-2 border-primary/20 shadow-2xl">
                    <Icon className="h-20 w-20 text-primary" />
                    <div className="absolute -bottom-3 -right-3 bg-zinc-950 p-2 border-2 border-amber-500 shadow-xl">
                        <Construction className="h-6 w-6 text-amber-500" />
                    </div>
                </div>
            </div>

            <h1 className="font-heading text-5xl font-bold italic tracking-tight mb-6 text-center max-w-2xl text-white">
                {title} <span className="text-primary not-italic font-black">Coming Soon</span>
            </h1>

            <p className="font-sans text-lg font-medium text-zinc-500 text-center max-w-lg mb-12 leading-relaxed tracking-wide">
                {description}
            </p>

            <Link href={actionLink}>
                <Button size="lg" className="rounded-none px-12 h-16 font-sans text-sm font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 active:translate-y-0">
                    {actionLabel}
                </Button>
            </Link>
        </div>
    )
}
