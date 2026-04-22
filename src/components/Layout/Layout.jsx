import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {/* Sidebar — visible on desktop (lg+) */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — visible on mobile only */}
      <BottomNav />
    </div>
  )
}
