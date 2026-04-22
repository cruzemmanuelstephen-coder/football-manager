import { Pencil, Trash2, MapPin, Clock, Home, Plane, BarChart2 } from 'lucide-react'
import { format, isPast, parseISO } from 'date-fns'
import { useTeam } from '../../contexts/TeamContext'

const resultColors = {
  win:  'bg-green-500/20 text-green-400 border-green-500/30',
  loss: 'bg-red-500/20 text-red-400 border-red-500/30',
  draw: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

export default function MatchCard({ match, onEdit, onStats }) {
  const { deleteMatch } = useTeam()
  const past = isPast(parseISO(match.date))

  async function handleDelete() {
    if (!confirm(`Delete match vs ${match.opponent}?`)) return
    await deleteMatch(match.id)
  }

  return (
    <div className="glass-hover p-4 flex items-center gap-4 animate-fade-in">
      {/* Date block */}
      <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border ${
        past ? 'bg-dark-700/50 border-white/5' : 'bg-primary-500/10 border-primary-500/20'
      }`}>
        <span className={`text-xl font-bold leading-none ${past ? 'text-dark-300' : 'text-primary-400'}`}>
          {format(parseISO(match.date), 'd')}
        </span>
        <span className={`text-[10px] font-medium uppercase tracking-wide ${past ? 'text-dark-500' : 'text-primary-500'}`}>
          {format(parseISO(match.date), 'MMM')}
        </span>
      </div>

      {/* Match info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-white font-semibold">vs {match.opponent}</p>
          {match.isHome
            ? <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30"><Home size={10} className="mr-1" />Home</span>
            : <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30"><Plane size={10} className="mr-1" />Away</span>
          }
          {match.result && (
            <span className={`badge border ${resultColors[match.result]}`}>
              {match.result.charAt(0).toUpperCase() + match.result.slice(1)}
            </span>
          )}
        </div>
        <div className="flex gap-3 mt-1 text-dark-400 text-xs flex-wrap">
          <span className="flex items-center gap-1"><Clock size={11} />{match.time || 'TBD'}</span>
          {match.location && <span className="flex items-center gap-1"><MapPin size={11} />{match.location}</span>}
        </div>
        {match.score && (
          <p className="text-primary-400 font-bold text-sm mt-1">{match.score}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        {onStats && (
          <button id={`stats-match-${match.id}`} onClick={onStats} title="Player Stats" className="p-1.5 rounded-lg text-primary-400 hover:text-white hover:bg-primary-500/20 transition-all">
            <BarChart2 size={14} />
          </button>
        )}
        {onEdit && (
          <>
            <button id={`edit-match-${match.id}`} onClick={onEdit} title="Edit Match" className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-all">
              <Pencil size={14} />
            </button>
            <button id={`delete-match-${match.id}`} onClick={handleDelete} title="Delete Match" className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
