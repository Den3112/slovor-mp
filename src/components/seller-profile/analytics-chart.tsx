'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DataPoint {
  date: string
  value: number
}

interface AnalyticsChartProps {
  data: DataPoint[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  // SVG Chart implementation
  const width = 800
  const height = 240
  const paddingX = 40
  const paddingY = 30

  const pathData = useMemo(() => {
    if (!data || data.length < 2) return ''
    const maxVal = Math.max(...data.map((d) => d.value), 1)
    const stepX = (width - paddingX * 2) / (data.length - 1)

    const points = data.map((d, i) => ({
      x: paddingX + i * stepX,
      y: height - paddingY - (d.value / maxVal) * (height - paddingY * 2),
    }))

    // Create a smooth bezier path
    let d = `M ${points[0]!.x},${points[0]!.y}`

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]!
      const p1 = points[i + 1]!
      const cp1x = p0.x + (p1.x - p0.x) / 2
      const cp1y = p0.y
      const cp2x = p0.x + (p1.x - p0.x) / 2
      const cp2y = p1.y
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
    }
    return d
  }, [data])

  const areaPathData = useMemo(() => {
    if (!pathData) return ''
    return `${pathData} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`
  }, [pathData])

  return (
    <div className="group/chart relative h-full w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.15"
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0"
            />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid System */}
        <g className="text-muted-foreground/5">
          {/* Horizontal lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={`h-${i}`}
              x1={paddingX}
              y1={paddingY + p * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={paddingY + p * (height - paddingY * 2)}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          {/* Vertical lines at data points */}
          {data.map((_, i) => {
            const stepX = (width - paddingX * 2) / (data.length - 1)
            const x = paddingX + i * stepX
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={paddingY}
                x2={x}
                y2={height - paddingY}
                stroke="currentColor"
                strokeWidth="1"
              />
            )
          })}
        </g>

        {/* Area Background */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          d={areaPathData}
          fill="url(#chartGradient)"
        />

        {/* Main Smooth Line */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Refined Data Points */}
        {data.map((d, i) => {
          const maxVal = Math.max(...data.map((dp) => dp.value), 1)
          const stepX = (width - paddingX * 2) / (data.length - 1)
          const x = paddingX + i * stepX
          const y =
            height - paddingY - (d.value / maxVal) * (height - paddingY * 2)

          return (
            <g key={i} className="group/point cursor-pointer">
              {/* Inner point */}
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="hsl(var(--background))"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="group-hover/point:r-5 group-hover/point:stroke-width-3 transition-all duration-300"
              />

              {/* Hover Tooltip */}
              <g className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover/point:opacity-100">
                <rect
                  x={x - 24}
                  y={y - 38}
                  width="48"
                  height="24"
                  rx="6"
                  fill="hsl(var(--primary))"
                  className="shadow-lg"
                />
                <text
                  x={x}
                  y={y - 22}
                  textAnchor="middle"
                  className="fill-primary-foreground text-[10px] font-bold"
                >
                  {d.value}
                </text>
              </g>
            </g>
          )
        })}
      </svg>

      {/* X-Axis Labels */}
      <div
        className="text-muted-foreground/60 mt-4 flex items-center"
        style={{ paddingLeft: paddingX, paddingRight: paddingX }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 text-center first:text-left last:text-right',
              i % 2 !== 0 && 'hidden sm:block' // Hide interleaved labels on mobile
            )}
          >
            <span className="mx-auto block max-w-[40px] truncate text-[9px] leading-none font-bold tracking-widest uppercase sm:max-w-none">
              {d.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
