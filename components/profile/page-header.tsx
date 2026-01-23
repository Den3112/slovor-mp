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
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start',
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="font-heading text-foreground text-3xl font-black tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base font-medium">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
