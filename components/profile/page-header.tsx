import { cn } from '@/lib/utils'

interface DashboardPageHeaderProps {
    title: string
    description?: string
    children?: React.ReactNode
    className?: string
}

export function DashboardPageHeader({
    title,
    description,
    children,
    className
}: DashboardPageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12", className)}>
            <div className="space-y-3">
                <h1 className="font-heading text-5xl font-bold italic tracking-tight text-white">
                    {title}
                </h1>
                {description && (
                    <p className="font-sans text-sm font-medium tracking-wide text-zinc-500 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    )
}
