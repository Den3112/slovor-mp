import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart';
import { useTranslation } from '@/lib/i18n';
import { PerformanceChartProps } from './types';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function PerformanceCard({ data }: PerformanceChartProps) {
    const { t } = useTranslation(['dashboard']);

    return (
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
            <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden rounded-xl">
                <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                {t('dashboard:performance')}
                            </CardTitle>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">{t('dashboard:viewsOverTime')}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-border/60 rounded-sm">
                            Last 7 Days
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-8 min-h-[320px]">
                    <AnalyticsChart data={data} />
                </CardContent>
            </Card>
        </motion.div>
    );
}
