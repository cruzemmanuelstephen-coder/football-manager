import { useState, useEffect } from 'react'
import { Loader2, ClipboardCheck, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { useTeam } from '../contexts/TeamContext'
import { format, parseISO } from 'date-fns'

export default function AttendancePage() {
  const { matches, players, loading, team, getAttendance, setAttendance } = useTeam()
  const [selectedMatchId,  setSelectedMatchId]  = useState(null)
  const [attendance,       setAttendanceMap]     = useState({}) // { playerId: available }
  const [loadingAttend,    setLoadingAttend]     = useState(false)
  const [saving,           setSaving]            = useState(null) // playerId being saved

  // Auto-select first upcoming match
  useEffect(() => {
    if (!selectedMatchId && matches.length > 0) {
      const first = [...matches].sort((a, b) => a.date.localeCompare(b.date))[0]
      setSelectedMatchId(first.id)
    }
  }, [matches])

  // Load attendance when match changes
  useEffect(() => {
    if (!selectedMatchId) return
    setLoadingAttend(true)
    getAttendance(selectedMatchId).then(rows => {
      const map = {}
      rows.forEach(r => { map[r.playerId] = r.available })
      setAttendanceMap(map)
      setLoadingAttend(false)
    })
  }, [selectedMatchId])

  if (!team)    return <NoTeamMessage />
  if (loading)  return <LoadingSpinner />

  const selectedMatch = matches.find(m => m.id === selectedMatchId)

  async function handleToggle(playerId, value) {
    setSaving(playerId)
    await setAttendance(selectedMatchId, playerId, value)
    setAttendanceMap(prev => ({ ...prev, [playerId]: value }))
    setSaving(null)
  }

  const yes  = players.filter(p => attendance[p.id] === true).length
  const no   = players.filter(p => attendance[p.id] === false).length
  const pend = players.length - yes - no

  return (
    <div className="page space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Attendance</h2>
        <p className="text-dark-400 text-sm">Track player availability per match</p>
      </div>

      {/* Match selector */}
      {matches.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center py-12 text-center">
          <Calendar size={36} className="text-dark-600 mb-3" />
          <p className="text-dark-400">No matches scheduled yet.</p>
        </div>
      ) : (
        <>
          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Select Match</label>
            <select
              id="attendance-match-select"
              value={selectedMatchId || ''}
              onChange={e => setSelectedMatchId(e.target.value)}
              className="input"
            >
              {[...matches]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(m => (
                  <option key={m.id} value={m.id}>
                    {format(parseISO(m.date), 'MMM d, yyyy')} — vs {m.opponent}
                  </option>
                ))}
            </select>
          </div>

          {/* Summary pills */}
          <div className="flex gap-3 flex-wrap">
            <SummaryPill icon={<CheckCircle2 size={14} className="text-green-400" />} label="Available" count={yes} color="green" />
            <SummaryPill icon={<XCircle size={14} className="text-red-400" />}        label="Unavailable" count={no}  color="red" />
            <SummaryPill icon={<ClipboardCheck size={14} className="text-dark-400" />} label="Pending"  count={pend} color="gray" />
          </div>

          {/* Player list */}
          {loadingAttend ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={24} className="animate-spin text-primary-500" />
            </div>
          ) : players.length === 0 ? (
            <div className="glass flex flex-col items-center justify-center py-12 text-center">
              <p className="text-dark-400">Add players first to track attendance.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map(player => {
                const status = attendance[player.id]
                const isLoading = saving === player.id
                return (
                  <div key={player.id} className="glass p-4 flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-600 to-dark-700 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {player.name?.[0]?.toUpperCase()}
                    </div>

                    {/* Name + position */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                      <p className="text-dark-500 text-xs">{player.position}</p>
                    </div>

                    {/* Toggle */}
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin text-primary-500" />
                    ) : (
                      <div className="flex gap-2">
                        <button
                          id={`attend-yes-${player.id}`}
                          onClick={() => handleToggle(player.id, true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                            status === true
                              ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-sm'
                              : 'bg-dark-800 text-dark-500 border-white/5 hover:border-green-500/30 hover:text-green-400'
                          }`}
                        >
                          ✓ Yes
                        </button>
                        <button
                          id={`attend-no-${player.id}`}
                          onClick={() => handleToggle(player.id, false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                            status === false
                              ? 'bg-red-500/20 text-red-400 border-red-500/30 shadow-sm'
                              : 'bg-dark-800 text-dark-500 border-white/5 hover:border-red-500/30 hover:text-red-400'
                          }`}
                        >
                          ✗ No
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SummaryPill({ icon, label, count, color }) {
  const colorMap = {
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red:   'bg-red-500/10 border-red-500/20 text-red-400',
    gray:  'bg-dark-700 border-white/10 text-dark-400',
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${colorMap[color]}`}>
      {icon}
      {count} {label}
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
