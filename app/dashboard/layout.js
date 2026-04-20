import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({ children }) {
  return (
    <div
      data-theme="dashboard"
      className="flex min-h-screen transition-colors duration-200"
      style={{ backgroundColor: 'var(--db-bg)' }}
    >
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
