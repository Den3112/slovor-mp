import { AdminDashboardLayout } from '@/components/features/dashboard/admin/admin-dashboard-layout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>
}
