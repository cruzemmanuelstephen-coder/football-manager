import { useState } from 'react'
import {
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  MapPin,
  Clock,
  PlusCircle,
  Loader2,
  Pencil,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTeam } from '../contexts/TeamContext'
import { format, isPast, parseISO, differenceInDays } from 'date-fns'
import CreateTeamModal from '../components/Dashboard/CreateTeamModal'

export default function DashboardPage() {
  const { user } = useAuth()
  const { team, players, matches, loading } = useTeam()
  const [showCreate, setShowCreate] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    )
  }

  // If no team yet, show onboarding
  if (!team) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6">
            <Trophy size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user?.displayName}!</h2>
          <p className="text-dark-400 mb-8 max-w-xs">
            You haven't created your team yet. Let's get started!
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2 text-base px-6 py-3"
          >
            <PlusCircle size={18} />
            Create My Team
          </button>
        </div>
        {showCreate && <CreateTeamModal onClose={() => setShowCreate(false)} />}
      </>
    )
  }

  // Next upcoming match
  const upcoming = matches
    .filter(m => !isPast(parseISO(m.date)))
    .sort((a, b) => a.date.localeCompare(b.date))
  const nextMatch = upcoming[0]

  // Stats
  const totalGoals   = players.reduce((s, p) => s + (p.goals   || 0), 0)
  const totalAssists = players.reduce((s, p) => s + (p.assists || 0), 0)
  const pastMatches  = matches.filter(m => isPast(parseISO(m.date)))

  return (
    <div className="page space-y-6 max-w-4xl mx-auto">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Hey, {user?.displayName?.split(' ')[0]} 👋
          </h2>
          <p className="text-dark-400 text-sm mt-0.5">{team.name}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
          {user?.displayName?.[0]?.toUpperCase()}
        </div>
      </div>

      {/* Next match card */}
      {nextMatch ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 shadow-xl shadow-primary-900/50">
          {/* Decorative circle */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex items-center gap-2 text-primary-200 text-sm font-medium mb-3">
              <Calendar size={14} />
              Next Match
              {differenceInDays(parseISO(nextMatch.date), new Date()) === 0 && (
                <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Today!</span>
              )}
            </div>
            <h3 className="text-white text-xl font-bold mb-1">vs {nextMatch.opponent}</h3>
            <div className="flex flex-wrap gap-3 text-primary-100 text-sm mt-3">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {format(parseISO(nextMatch.date), 'MMM d')} · {nextMatch.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {nextMatch.location || 'TBD'}
              </span>
              <span className="flex items-center gap-1.5">
                {nextMatch.isHome ? '🏠 Home' : '✈️ Away'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <Calendar size={22} className="text-primary-500" />
          </div>
          <div>
            <p className="text-white font-semibold">No upcoming matches</p>
            <p className="text-dark-400 text-sm">Schedule your next match in the Matches tab</p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Users size={20} className="text-blue-400" />}  label="Players"      value={players.length}   color="blue" />
        <StatCard icon={<Calendar size={20} className="text-purple-400" />} label="Matches"  value={matches.length}   color="purple" />
        <StatCard icon={<Trophy size={20} className="text-yellow-400" />}  label="Goals"    value={totalGoals}        color="yellow" />
        <StatCard icon={<TrendingUp size={20} className="text-primary-400" />} label="Assists" value={totalAssists}   color="green" />
      </div>

      {/* Recent matches */}
      {pastMatches.length > 0 && (
        <div>
          <h3 className="section-title">Recent Results</h3>
          <div className="space-y-2">
            {pastMatches.slice(0, 3).map(match => (
              <div key={match.id} className="glass-hover p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">vs {match.opponent}</p>
                  <p className="text-dark-400 text-xs mt-0.5">
                    {format(parseISO(match.date), 'MMM d, yyyy')} · {match.isHome ? 'Home' : 'Away'}
                  </p>
                </div>
                {match.result ? (
                  <span className={`badge ${
                    match.result === 'win'  ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    match.result === 'loss' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-dark-600 text-dark-300 border border-dark-500'
                  }`}>
                    {match.result?.charAt(0).toUpperCase() + match.result?.slice(1)}
                  </span>
                ) : (
                  <span className="badge bg-dark-700 text-dark-400">–</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top players */}
      {players.length > 0 && (
        <div>
          <h3 className="section-title">Top Scorers</h3>
          <div className="space-y-2">
            {[...players]
              .sort((a, b) => (b.goals || 0) - (a.goals || 0))
              .slice(0, 3)
              .map((player, i) => (
                <div key={player.id} className="glass p-3 flex items-center gap-3">
                  <span className="text-dark-400 text-sm font-bold w-5 text-center">{i + 1}</span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dark-600 to-dark-700 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                    {player.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{player.name}</p>
                    <p className="text-dark-400 text-xs">{player.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-400 font-bold">{player.goals || 0}</p>
                    <p className="text-dark-500 text-xs">goals</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue:   'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    green:  'bg-primary-500/10 border-primary-500/20',
  }
  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-2 ${colorMap[color]}`}>
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-dark-400 text-xs font-medium">{label}</p>
      </div>
    </div>
  )
}
