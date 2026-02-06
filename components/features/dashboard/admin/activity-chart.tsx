'use client';

import { useEffect, useState } from 'react';
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart';
import { Loader2 } from 'lucide-react';

export function ActivityChart() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data for now, ideally fetch from an API that returns time-series data
        const mockData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toLocaleDateString(undefined, { weekday: 'short' }),
                value: Math.floor(Math.random() * 100) + 20,
            };
        });

        const timer = setTimeout(() => {
            setData(mockData);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
            </div>
        );
    }

    return <AnalyticsChart data={data} />;
}
