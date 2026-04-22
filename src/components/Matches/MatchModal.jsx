import { useState } from 'react'
import { Loader2, Calendar, Pencil } from 'lucide-react'
import { useTeam } from '../../contexts/TeamContext'

const RESULTS = ['', 'win', 'loss', 'draw']

export default function MatchModal({ match, onClose }) {
  const { addMatch, updateMatch } = useTeam()
  const isEdit = Boolean(match)

  const [form, setForm] = useState({
    opponent: match?.opponent || '',
    date:     match?.date     || '',
    time:     match?.time     || '',
    location: match?.location || '',
    isHome:   match?.isHome   ?? true,
    result:   match?.result   || '',
    score:    match?.score    || '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function update(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.opponent.trim()) { setError('Opponent name is required.'); return }
    if (!form.date)            { setError('Match date is required.');    return }
    setLoading(true)
    try {
      if (isEdit) {
        await updateMatch(match.id, form)
      } else {
        await addMatch(form)
      }
      onClose()
    } catch {
      setError('Failed to save match. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            {isEdit ? <Pencil size={18} className="text-primary-400" /> : <Calendar size={18} className="text-primary-400" />}
          </div>
          <div>
            <h2 className="text-white font-bold">{isEdit ? 'Edit Match' : 'Schedule a Match'}</h2>
            <p className="text-dark-400 text-xs">Fill in the match details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Opponent */}
          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Opponent *</label>
            <input
              id="match-opponent"
              type="text"
              placeholder="e.g. Red Lions FC"
              value={form.opponent}
              onChange={e => update('opponent', e.target.value)}
              className="input"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-dark-300 text-xs font-medium mb-1.5 block">Date *</label>
              <input
                id="match-date"
                type="date"
                value={form.date}
                onChange={e => update('date', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="text-dark-300 text-xs font-medium mb-1.5 block">Time</label>
              <input
                id="match-time"
                type="time"
                value={form.time}
                onChange={e => update('time', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Location</label>
            <input
              id="match-location"
              type="text"
              placeholder="e.g. City Stadium"
              value={form.location}
              onChange={e => update('location', e.target.value)}
              className="input"
            />
          </div>

          {/* Home / Away toggle */}
          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Venue</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update('isHome', true)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                  form.isHome
                    ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                    : 'bg-dark-800 text-dark-400 border-white/5 hover:border-white/10'
                }`}
              >
                🏠 Home
              </button>
              <button
                type="button"
                onClick={() => update('isHome', false)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                  !form.isHome
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-dark-800 text-dark-400 border-white/5 hover:border-white/10'
                }`}
              >
                ✈️ Away
              </button>
            </div>
          </div>

          {/* Result (only for editing) */}
          {isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dark-300 text-xs font-medium mb-1.5 block">Result</label>
                <select
                  id="match-result"
                  value={form.result}
                  onChange={e => update('result', e.target.value)}
                  className="input"
                >
                  <option value="">Not played</option>
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                  <option value="draw">Draw</option>
                </select>
              </div>
              <div>
                <label className="text-dark-300 text-xs font-medium mb-1.5 block">Score</label>
                <input
                  id="match-score"
                  type="text"
                  placeholder="e.g. 3-1"
                  value={form.score}
                  onChange={e => update('score', e.target.value)}
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
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Schedule Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
