import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Home'      },
  { to: '/players',     icon: Users,            label: 'Players'   },
  { to: '/matches',     icon: Calendar,         label: 'Matches'   },
  { to: '/attendance',  icon: ClipboardCheck,   label: 'Attend'    },
  { to: '/stats',       icon: BarChart3,        label: 'Stats'     },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-950/95 backdrop-blur-xl border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary-400' : 'text-dark-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary-500/15' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
