import { useState } from 'react'
import { PlusCircle, Calendar, Loader2, Clock, MapPin } from 'lucide-react'
import { useTeam } from '../contexts/TeamContext'
import { useAuth } from '../contexts/AuthContext'
import { format, isPast, parseISO } from 'date-fns'
import MatchCard from '../components/Matches/MatchCard'
import MatchModal from '../components/Matches/MatchModal'

export default function MatchesPage() {
  const { profile } = useAuth()
  const { matches, loading, team } = useTeam()
  const [showAdd,   setShowAdd]   = useState(false)
  const [editMatch, setEditMatch] = useState(null)
  const [tab,       setTab]       = useState('upcoming') // 'upcoming' | 'past'

  if (!team) return <NoTeamMessage />
  if (loading) return <LoadingSpinner />

  const upcoming = matches.filter(m => !isPast(parseISO(m.date)))
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = matches.filter(m => isPast(parseISO(m.date)))
    .sort((a, b) => b.date.localeCompare(a.date))

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="page space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Matches</h2>
          <p className="text-dark-400 text-sm">{upcoming.length} upcoming</p>
        </div>
        {profile?.role === 'admin' && (
          <button id="add-match-btn" onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Match</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {['upcoming', 'past'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t
                ? 'bg-primary-500 text-white shadow'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {/* Match list */}
      {list.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center py-16 text-center">
          <Calendar size={40} className="text-dark-600 mb-3" />
          <p className="text-dark-400 font-medium">
            {tab === 'upcoming' ? 'No upcoming matches' : 'No past matches'}
          </p>
          {tab === 'upcoming' && profile?.role === 'admin' && (
            <button onClick={() => setShowAdd(true)} className="mt-4 btn-primary text-sm">
              Schedule a match
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onEdit={profile?.role === 'admin' ? () => setEditMatch(match) : null}
            />
          ))}
        </div>
      )}

      {showAdd    && <MatchModal onClose={() => setShowAdd(false)} />}
      {editMatch  && <MatchModal match={editMatch} onClose={() => setEditMatch(null)} />}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  )
}
function NoTeamMessage() {
  return (
    <div className="flex items-center justify-center h-64 text-dark-400">
      <p>Create a team first from the Dashboard.</p>
    </div>
  )
}
