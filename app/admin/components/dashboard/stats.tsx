
interface DashboardStatsProps {
    total: number
    active: number
    inactive: number
}

export function DashboardStats({ total, active, inactive }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Total Listings</p>
                <p className="text-3xl font-bold">{total}</p>
            </div>
            <div className="bg-card rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Active</p>
                <p className="text-3xl font-bold text-green-500">{active}</p>
            </div>
            <div className="bg-card rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Inactive</p>
                <p className="text-3xl font-bold text-red-500">{inactive}</p>
            </div>
        </div>
    )
}
