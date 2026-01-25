
import { Button } from '@/components/ui/button'

interface DashboardFiltersProps {
    filter: 'all' | 'pending' | 'flagged'
    setFilter: (filter: 'all' | 'pending' | 'flagged') => void
}

export function DashboardFilters({ filter, setFilter }: DashboardFiltersProps) {
    return (
        <div className="flex gap-2">
            {(['all', 'pending', 'flagged'] as const).map((f) => (
                <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    onClick={() => setFilter(f)}
                    size="sm"
                >
                    {f === 'all' && 'All Listings'}
                    {f === 'pending' && 'Pending Review'}
                    {f === 'flagged' && 'Flagged'}
                </Button>
            ))}
        </div>
    )
}
