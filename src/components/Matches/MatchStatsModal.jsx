import { useState, useEffect } from 'react'
import { X, Loader2, Trophy, ArrowUpRight } from 'lucide-react'
import { useTeam } from '../../contexts/TeamContext'

export default function MatchStatsModal({ match, onClose }) {
  const { players, getAttendance, saveMatchStats } = useTeam()
  
  // Array of { playerId, goals, assists, oldGoals, oldAssists }
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch current stats from attendance subcollection
    getAttendance(match.id).then((attendanceRows) => {
      // Create a lookup map
      const attendanceMap = {}
      attendanceRows.forEach(r => { attendanceMap[r.playerId] = r })

      // Initialize state for all current players
      const initialStats = players.map(player => {
        const row = attendanceMap[player.id] || {}
        return {
          playerId: player.id,
          name: player.name,
          position: player.position,
          goals: row.goals || 0,
          assists: row.assists || 0,
          oldGoals: row.goals || 0,
          oldAssists: row.assists || 0,
          available: row.available, // To optionally display if they played
        }
      })
      
      setStats(initialStats)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setError('Failed to load stats')
      setLoading(false)
    })
  }, [match.id, players])

  function updateStat(playerId, field, delta) {
    setStats(prev => prev.map(s => {
      if (s.playerId === playerId) {
        const newValue = Math.max(0, s[field] + delta) // Prevent negative stats
        return { ...s, [field]: newValue }
      }
      return s
    }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    
    // Find players whose stats have actually changed
    const updates = stats
      .filter(s => s.goals !== s.oldGoals || s.assists !== s.oldAssists)
      .map(s => ({
        playerId: s.playerId,
        goals: s.goals,
        assists: s.assists,
        deltaGoals: s.goals - s.oldGoals,
        deltaAssists: s.assists - s.oldAssists
      }))

    try {
      if (updates.length > 0) {
        await saveMatchStats(match.id, updates)
      }
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to save stats.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">Player Stats</h3>
            <p className="text-dark-400 text-sm">vs {match.opponent}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={24} className="animate-spin text-primary-500" />
            </div>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <div className="space-y-3">
              {stats.map(player => (
                <div key={player.playerId} className="glass p-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dark-600 to-dark-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {player.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{player.name}</p>
                      {player.available === false && (
                        <span className="text-red-400 text-[10px] uppercase font-bold tracking-wider">Unavailable</span>
                      )}
                    </div>
                  </div>

                  {/* Counters */}
                  <div className="flex items-center gap-4 pl-11 sm:pl-0">
                    {/* Goals */}
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-yellow-400" />
                      <div className="flex items-center bg-dark-900 rounded-lg overflow-hidden border border-white/5">
                        <button
                          onClick={() => updateStat(player.playerId, 'goals', -1)}
                          className="w-7 h-7 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
                        >-</button>
                        <span className="w-6 text-center text-sm font-bold text-white">{player.goals}</span>
                        <button
                          onClick={() => updateStat(player.playerId, 'goals', 1)}
                          className="w-7 h-7 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
                        >+</button>
                      </div>
                    </div>

                    {/* Assists */}
                    <div className="flex items-center gap-2">
                      <ArrowUpRight size={14} className="text-primary-400" />
                      <div className="flex items-center bg-dark-900 rounded-lg overflow-hidden border border-white/5">
                        <button
                          onClick={() => updateStat(player.playerId, 'assists', -1)}
                          className="w-7 h-7 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
                        >-</button>
                        <span className="w-6 text-center text-sm font-bold text-white">{player.assists}</span>
                        <button
                          onClick={() => updateStat(player.playerId, 'assists', 1)}
                          className="w-7 h-7 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 shrink-0 flex gap-3 bg-dark-900/50">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Stats'}
          </button>
        </div>
      </div>
    </div>
  )
}
