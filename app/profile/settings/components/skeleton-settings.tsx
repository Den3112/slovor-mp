
export function SkeletonSettings() {
    return (
        <div className="animate-shimmer space-y-8">
            <div className="border-border/40 flex flex-col items-center gap-8 border-b pb-8 sm:flex-row sm:items-start">
                <div className="bg-muted h-32 w-32 rounded-full" />
                <div className="w-full max-sm flex-1 space-y-2">
                    <div className="bg-muted h-6 w-32 rounded" />
                    <div className="bg-muted h-4 w-48 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="bg-muted h-4 w-24 rounded" />
                        <div className="bg-muted h-12 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    )
}
