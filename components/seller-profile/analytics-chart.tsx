'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

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

    const points = useMemo(() => {
        if (!data || data.length < 2) return ''
        const maxVal = Math.max(...data.map((d) => d.value), 1)
        const stepX = (width - paddingX * 2) / (data.length - 1)

        return data
            .map((d, i) => {
                const x = paddingX + i * stepX
                const y = height - paddingY - (d.value / maxVal) * (height - paddingY * 2)
                return `${x},${y}`
            })
            .join(' ')
    }, [data])

    const areaPoints = useMemo(() => {
        if (!points || !data || data.length < 2) return ''
        const p = points.split(' ')
        const firstPoint = p[0]
        const lastPoint = p[p.length - 1]
        if (!firstPoint || !lastPoint) return ''
        const firstX = firstPoint.split(',')[0]
        const lastX = lastPoint.split(',')[0]
        return `${firstX},${height - paddingY} ${points} ${lastX},${height - paddingY}`
    }, [points, data])

    return (
        <div className="w-full h-full relative group/chart">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Y-Axis Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <line
                        key={i}
                        x1={paddingX}
                        y1={paddingY + p * (height - paddingY * 2)}
                        x2={width - paddingX}
                        y2={paddingY + p * (height - paddingY * 2)}
                        stroke="currentColor"
                        strokeOpacity="0.05"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Area Background */}
                <motion.polyline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    points={areaPoints}
                    fill="url(#chartGradient)"
                />

                {/* Main Line */}
                <motion.polyline
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    points={points}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const maxVal = Math.max(...data.map((dp) => dp.value), 1)
                    const stepX = (width - paddingX * 2) / (data.length - 1)
                    const x = paddingX + i * stepX
                    const y = height - paddingY - (d.value / maxVal) * (height - paddingY * 2)

                    return (
                        <g key={i} className="cursor-pointer group/point">
                            <circle
                                cx={x}
                                cy={y}
                                r="4.5"
                                fill="hsl(var(--card))"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2.5"
                                className="transition-all group-hover/point:r-6"
                            />

                            {/* Hover State Info */}
                            <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200">
                                <rect
                                    x={x - 20}
                                    y={y - 35}
                                    width="40"
                                    height="20"
                                    rx="4"
                                    fill="hsl(var(--primary))"
                                />
                                <text
                                    x={x}
                                    y={y - 21}
                                    textAnchor="middle"
                                    className="fill-white text-[10px] font-bold"
                                >
                                    {d.value}
                                </text>
                            </g>
                        </g>
                    )
                })}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-4 px-[10px]">
                {data.map((d, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {d.date}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

