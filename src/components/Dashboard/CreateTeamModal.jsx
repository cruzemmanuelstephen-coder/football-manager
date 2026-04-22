import { useState } from 'react'
import { Loader2, Trophy } from 'lucide-react'
import { useTeam } from '../../contexts/TeamContext'

export default function CreateTeamModal({ onClose }) {
  const { createTeam } = useTeam()
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter a team name.'); return }
    setLoading(true)
    try {
      await createTeam(name.trim())
      onClose()
    } catch (err) {
      console.error('TEAM CREATION ERROR:', err)
      setError('Failed to create team. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-sm p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Name Your Team</h2>
            <p className="text-dark-400 text-xs">You can change this later</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="team-name"
            type="text"
            placeholder="e.g. Thunder FC"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            className="input"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? 'Creating…' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
