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
        <div className={cn("flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8", className)}>
            <div className="space-y-1">
                <h1 className="font-heading text-3xl font-black tracking-tight text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-muted-foreground font-medium text-base">
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
