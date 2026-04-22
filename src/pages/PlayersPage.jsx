import { useState } from 'react'
import { PlusCircle, Search, Users, Loader2 } from 'lucide-react'
import { useTeam } from '../contexts/TeamContext'
import { useAuth } from '../contexts/AuthContext'
import PlayerCard from '../components/Players/PlayerCard'
import PlayerModal from '../components/Players/PlayerModal'

export default function PlayersPage() {
  const { profile } = useAuth()
  const { players, loading, team } = useTeam()
  const [search,      setSearch]      = useState('')
  const [showAdd,     setShowAdd]     = useState(false)
  const [editPlayer,  setEditPlayer]  = useState(null)

  if (!team) return <NoTeamMessage />
  if (loading) return <LoadingSpinner />

  const canEdit = profile?.role === 'admin'

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.position?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Players</h2>
          <p className="text-dark-400 text-sm">{players.length} player{players.length !== 1 ? 's' : ''} in squad</p>
        </div>
        {canEdit && (
          <button
            id="add-player-btn"
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Player</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          placeholder="Search by name or position…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Players grid */}
      {filtered.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center py-16 text-center">
          <Users size={40} className="text-dark-600 mb-3" />
          <p className="text-dark-400 font-medium">
            {search ? 'No players match your search' : 'No players yet'}
          </p>
          {!search && profile?.role === 'coach' && (
            <button onClick={() => setShowAdd(true)} className="mt-4 btn-primary text-sm">
              Add your first player
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={profile?.role === 'coach' ? () => setEditPlayer(player) : null}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd && <PlayerModal onClose={() => setShowAdd(false)} />}
      {editPlayer && <PlayerModal player={editPlayer} onClose={() => setEditPlayer(null)} />}
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
    <div className="flex items-center justify-center h-64 text-dark-400 text-center">
      <p>Create a team first from the Dashboard.</p>
    </div>
  )
}
