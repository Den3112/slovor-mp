import { DashboardStats } from '@/lib/api/dashboard-stats';

export interface OverviewHeaderProps {
    user: any;
}

export interface OverviewStatsProps {
    stats: DashboardStats;
}

export interface PerformanceChartProps {
    data: any[];
}

export interface RecentActivityTableProps {
    listings: any[];
}
