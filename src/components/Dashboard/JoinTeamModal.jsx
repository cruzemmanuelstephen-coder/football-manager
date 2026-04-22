import { useState } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function JoinTeamModal({ onClose }) {
  const { joinTeam } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setError('')
    setLoading(true)
    try {
      await joinTeam(code.trim())
      onClose()
    } catch (err) {
      setError(err.message || 'Invalid Team Code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Join a Team</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="team-code" className="block text-sm font-medium text-dark-300 mb-1.5">
              Team Code
            </label>
            <input
              id="team-code"
              type="text"
              placeholder="Paste the code from your admin"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="input w-full"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="flex-1 btn-primary flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
