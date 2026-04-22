import { Pencil, Trash2, Goal, Zap } from 'lucide-react'
import { useTeam } from '../../contexts/TeamContext'

const positionColors = {
  Goalkeeper: 'pos-gk',
  Defender:   'pos-def',
  Midfielder: 'pos-mid',
  Forward:    'pos-fwd',
}

export default function PlayerCard({ player, onEdit }) {
  const { deletePlayer } = useTeam()

  async function handleDelete() {
    if (!confirm(`Remove ${player.name} from the squad?`)) return
    await deletePlayer(player.id)
  }

  const badgeClass = positionColors[player.position] || 'bg-dark-600 text-dark-300'

  return (
    <div className="glass-hover p-4 flex flex-col gap-3 animate-fade-in">
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Avatar with jersey number */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-600 to-dark-700 border border-white/10 flex items-center justify-center text-white font-bold text-lg">
            {player.name?.[0]?.toUpperCase()}
          </div>
          {player.number && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary-500 border border-dark-800 flex items-center justify-center text-white text-[10px] font-bold">
              {player.number}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{player.name}</p>
          <span className={`badge mt-1 ${badgeClass}`}>{player.position || 'No position'}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            id={`edit-player-${player.id}`}
            onClick={onEdit}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Pencil size={14} />
          </button>
          <button
            id={`delete-player-${player.id}`}
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-sm">
          <Goal size={14} className="text-primary-400" />
          <span className="text-white font-semibold">{player.goals || 0}</span>
          <span className="text-dark-500 text-xs">goals</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Zap size={14} className="text-amber-400" />
          <span className="text-white font-semibold">{player.assists || 0}</span>
          <span className="text-dark-500 text-xs">assists</span>
        </div>
      </div>
    </div>
  )
}
