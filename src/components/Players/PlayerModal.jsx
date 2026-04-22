import { useState } from 'react'
import { Loader2, UserPlus, Pencil } from 'lucide-react'
import { useTeam } from '../../contexts/TeamContext'

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

export default function PlayerModal({ player, onClose }) {
  const { addPlayer, updatePlayer } = useTeam()
  const isEdit = Boolean(player)

  const [form, setForm] = useState({
    name:     player?.name     || '',
    position: player?.position || 'Midfielder',
    number:   player?.number   || '',
    goals:    player?.goals    || 0,
    assists:  player?.assists  || 0,
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Player name is required.'); return }
    setLoading(true)
    try {
      if (isEdit) {
        await updatePlayer(player.id, {
          ...form,
          number:  form.number  ? Number(form.number)  : null,
          goals:   Number(form.goals),
          assists: Number(form.assists),
        })
      } else {
        await addPlayer({
          ...form,
          number:  form.number ? Number(form.number) : null,
          goals:   Number(form.goals),
          assists: Number(form.assists),
        })
      }
      onClose()
    } catch {
      setError('Failed to save player. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-md p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            {isEdit ? <Pencil size={18} className="text-primary-400" /> : <UserPlus size={18} className="text-primary-400" />}
          </div>
          <div>
            <h2 className="text-white font-bold">{isEdit ? 'Edit Player' : 'Add New Player'}</h2>
            <p className="text-dark-400 text-xs">Fill in the player details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Full Name *</label>
            <input
              id="player-name"
              type="text"
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              className="input"
            />
          </div>

          {/* Position + Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-dark-300 text-xs font-medium mb-1.5 block">Position</label>
              <select
                id="player-position"
                value={form.position}
                onChange={e => update('position', e.target.value)}
                className="input"
              >
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-dark-300 text-xs font-medium mb-1.5 block">Jersey #</label>
              <input
                id="player-number"
                type="number"
                placeholder="e.g. 10"
                min="1" max="99"
                value={form.number}
                onChange={e => update('number', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Goals + Assists (only show in edit mode) */}
          {isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dark-300 text-xs font-medium mb-1.5 block">Goals</label>
                <input
                  id="player-goals"
                  type="number"
                  min="0"
                  value={form.goals}
                  onChange={e => update('goals', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="text-dark-300 text-xs font-medium mb-1.5 block">Assists</label>
                <input
                  id="player-assists"
                  type="number"
                  min="0"
                  value={form.assists}
                  onChange={e => update('assists', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
