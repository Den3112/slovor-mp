// Dashboard Entity Public API
// Note: 'api/index' is server-only (marked with server-only)
// 'api/types' is client-safe.

export * from './api/types'
// We do NOT export './api' here to prevent accidental leakage into client components.
// Server components should import directly from '@/entities/dashboard/api'.
