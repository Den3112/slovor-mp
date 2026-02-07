import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart'
import { useTranslation } from '@/lib/i18n'
import { PerformanceChartProps } from './types'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function PerformanceCard({ data }: PerformanceChartProps) {
  const { t } = useTranslation(['dashboard'])

  return (
    <motion.div variants={item} className="space-y-4">
      <Card className="border-border/40 flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="border-border/10 bg-muted/5 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('dashboard:performance')}
              </CardTitle>
              <p className="text-muted-foreground/40 mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('dashboard:viewsOverTime')}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-border/20 bg-background px-3 py-1 text-[9px] font-bold tracking-widest uppercase"
            >
              {t('dashboard:last7Days')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="min-h-[320px] p-6 pt-8">
          <AnalyticsChart data={data} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
