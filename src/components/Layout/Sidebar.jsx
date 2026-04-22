import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Trophy,
  Settings,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTeam } from '../../contexts/TeamContext'
import EditProfileModal from '../Auth/EditProfileModal'

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players',    icon: Users,            label: 'Players'   },
  { to: '/matches',    icon: Calendar,         label: 'Matches'   },
  { to: '/attendance', icon: ClipboardCheck,   label: 'Attendance'},
  { to: '/stats',      icon: BarChart3,        label: 'Stats'     },
]

export default function Sidebar() {
  const { user, profile, logout } = useAuth()
  const { team } = useTeam()
  const [showEditProfile, setShowEditProfile] = useState(false)

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-dark-950 border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Trophy size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">{team?.name || 'My Team'}</p>
          <p className="text-dark-400 text-xs">Football Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Invite Button */}
      {profile?.role === 'admin' && team && (
        <div className="px-4 py-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(team.id);
              alert('Team Code copied to clipboard!');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 font-medium text-sm transition-colors border border-primary-500/20"
          >
            <Users size={16} />
            Copy Team Code
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.displayName?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.displayName || 'Admin'}</p>
            <p className="text-dark-400 text-xs truncate capitalize">{profile?.role || 'Admin'}</p>
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            title="Edit Profile"
            className="text-dark-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={logout}
            title="Sign out"
            className="text-dark-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>

      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
    </aside>
  )
}
