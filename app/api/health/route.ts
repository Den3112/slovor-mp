import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Docker/Kubernetes
 * Returns 200 OK if the application is healthy
 */
export async function GET() {
    const healthCheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    }

    return NextResponse.json(healthCheck, { status: 200 })
}
