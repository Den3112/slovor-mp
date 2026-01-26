'use client'

import { useMemo } from 'react'

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
    const height = 200
    const padding = 40

    const points = useMemo(() => {
        if (!data || data.length < 2) return ''
        const maxVal = Math.max(...data.map((d) => d.value), 1)
        const stepX = (width - padding * 2) / (data.length - 1)

        return data
            .map((d, i) => {
                const x = padding + i * stepX
                const y = height - padding - (d.value / maxVal) * (height - padding * 2)
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
        return `${firstX},${height - padding} ${points} ${lastX},${height - padding}`
    }, [points, data])

    return (
        <div className="w-full h-full relative group">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full drop-shadow-2xl"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + (i * (height - padding * 2)) / 4}
                        x2={width - padding}
                        y2={padding + (i * (height - padding * 2)) / 4}
                        stroke="currentColor"
                        strokeOpacity="0.05"
                        strokeWidth="1"
                    />
                ))}

                {/* Area */}
                <polyline
                    points={areaPoints}
                    fill="url(#chartGradient)"
                    className="transition-all duration-1000"
                />

                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const maxVal = Math.max(...data.map((dp) => dp.value), 1)
                    const stepX = (width - padding * 2) / (data.length - 1)
                    const x = padding + i * stepX
                    const y = height - padding - (d.value / maxVal) * (height - padding * 2)

                    return (
                        <g key={i} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill="var(--color-primary)"
                                className="cursor-pointer"
                            />
                            <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="fill-foreground text-[10px] font-bold"
                            >
                                {d.value}
                            </text>
                        </g>
                    )
                })}
            </svg>

            {/* Labels */}
            <div className="flex justify-between mt-2 px-[40px]">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {d.date}
                    </span>
                ))}
            </div>
        </div>
    )
}
