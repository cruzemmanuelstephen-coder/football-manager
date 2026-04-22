import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTeam } from '../../contexts/TeamContext'
import { Trophy, LogOut } from 'lucide-react'

const pageTitles = {
  '/dashboard':  'Dashboard',
  '/players':    'Players',
  '/matches':    'Matches',
  '/attendance': 'Attendance',
  '/stats':      'Statistics',
}

export default function TopBar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { team } = useTeam()

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/5 bg-dark-900/80 backdrop-blur-sm shrink-0">
      {/* Left: page title (mobile) / team name indicator */}
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Trophy size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight">
            {pageTitles[pathname] || 'Football Manager'}
          </h1>
          {team && (
            <p className="text-dark-400 text-xs leading-tight lg:hidden">{team.name}</p>
          )}
        </div>
      </div>

      {/* Right: avatar + logout (mobile) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
          {user?.displayName?.[0]?.toUpperCase() || 'C'}
        </div>
        <button
          onClick={logout}
          className="text-dark-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
