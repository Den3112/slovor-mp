'use client'

import { useEffect, useState } from 'react'

import { Activity, Database, ShieldCheck, Zap, Server } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VitalItemProps {
  label: string
  value: string | number
  status?: 'success' | 'warning' | 'error' | 'neutral'
  icon: any
}

function VitalItem({
  label,
  value,
  status = 'neutral',
  icon: Icon,
}: VitalItemProps) {
  const statusColors = {
    success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    error: 'text-destructive bg-destructive/10 border-destructive/20',
    neutral: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-2 px-3 transition-all',
        statusColors[status]
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex flex-col">
        <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">
          {label}
        </span>
        <span className="font-mono text-xs font-bold">{value}</span>
      </div>
    </div>
  )
}

export function SystemVitalsTicker() {
  const [metrics, setMetrics] = useState({
    latency: '24ms',
    uptime: '99.99%',
    dbStatus: 'Operational',
    cpu: '12%',
    memory: '1.2GB',
  })

  // Simulated real-time updates for the "Live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        latency: `${Math.floor(Math.random() * 20 + 15)}ms`,
        cpu: `${Math.floor(Math.random() * 15 + 8)}%`,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-3">
      <VitalItem
        label="API Latency"
        value={metrics.latency}
        icon={Zap}
        status="success"
      />
      <VitalItem
        label="DB Status"
        value={metrics.dbStatus}
        icon={Database}
        status="success"
      />
      <VitalItem
        label="Uptime"
        value={metrics.uptime}
        icon={ShieldCheck}
        status="success"
      />
      <VitalItem
        label="CPU Load"
        value={metrics.cpu}
        icon={Activity}
        status="neutral"
      />
      <VitalItem
        label="Memory"
        value={metrics.memory}
        icon={Server}
        status="neutral"
      />
    </div>
  )
}
