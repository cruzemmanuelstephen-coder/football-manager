import { Loader2, Goal, Zap, Medal } from 'lucide-react'
import { useTeam } from '../contexts/TeamContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'

const COLORS_GOALS   = '#10b981'
const COLORS_ASSISTS = '#f59e0b'

export default function StatsPage() {
  const { players, loading, team } = useTeam()

  if (!team)   return <NoTeamMessage />
  if (loading) return <LoadingSpinner />

  const sorted = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0))
  const topScorer  = sorted[0]
  const topAssist  = [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0))[0]
  const totalGoals = players.reduce((s, p) => s + (p.goals   || 0), 0)
  const totalAssts = players.reduce((s, p) => s + (p.assists || 0), 0)

  const chartData = sorted
    .filter(p => (p.goals || 0) + (p.assists || 0) > 0)
    .slice(0, 8)
    .map(p => ({
      name:    p.name.split(' ')[0],
      goals:   p.goals   || 0,
      assists: p.assists || 0,
    }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass p-3 text-sm space-y-1">
        <p className="font-semibold text-white">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.fill }}>
            {p.dataKey === 'goals' ? '⚽' : '⚡'} {p.value} {p.dataKey}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="page space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Statistics</h2>
        <p className="text-dark-400 text-sm">Season overview for your squad</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="Total Goals"   value={totalGoals} color="primary" />
        <MiniStat label="Total Assists" value={totalAssts} color="amber" />
        <MiniStat label="Players"       value={players.length} color="blue" />
        <MiniStat label="Avg Goals"
          value={players.length ? (totalGoals / players.length).toFixed(1) : '0.0'}
          color="purple"
        />
      </div>

      {/* Top performers */}
      {players.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topScorer && topScorer.goals > 0 && (
            <div className="glass p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Goal size={22} className="text-primary-400" />
              </div>
              <div>
                <p className="text-dark-400 text-xs font-medium">Top Scorer</p>
                <p className="text-white font-bold">{topScorer.name}</p>
                <p className="text-primary-400 text-sm font-semibold">{topScorer.goals} goals</p>
              </div>
            </div>
          )}
          {topAssist && topAssist.assists > 0 && (
            <div className="glass p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Zap size={22} className="text-amber-400" />
              </div>
              <div>
                <p className="text-dark-400 text-xs font-medium">Most Assists</p>
                <p className="text-white font-bold">{topAssist.name}</p>
                <p className="text-amber-400 text-sm font-semibold">{topAssist.assists} assists</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass p-5">
          <h3 className="text-white font-semibold mb-4">Goals & Assists</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="goals"   fill={COLORS_GOALS}   radius={[4,4,0,0]} name="Goals" />
              <Bar dataKey="assists" fill={COLORS_ASSISTS}  radius={[4,4,0,0]} name="Assists" />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex gap-4 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-dark-400">
              <span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" /> Goals
            </span>
            <span className="flex items-center gap-1.5 text-xs text-dark-400">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> Assists
            </span>
          </div>
        </div>
      )}

      {/* Full leaderboard */}
      {players.length > 0 && (
        <div>
          <h3 className="section-title">Leaderboard</h3>
          <div className="glass overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-dark-400 text-xs font-semibold px-4 py-3">#</th>
                  <th className="text-left text-dark-400 text-xs font-semibold px-4 py-3">Player</th>
                  <th className="text-left text-dark-400 text-xs font-semibold px-4 py-3">Pos</th>
                  <th className="text-center text-dark-400 text-xs font-semibold px-4 py-3">⚽</th>
                  <th className="text-center text-dark-400 text-xs font-semibold px-4 py-3">⚡</th>
                  <th className="text-center text-dark-400 text-xs font-semibold px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((player, i) => (
                  <tr key={player.id} className={`border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors ${i === 0 ? 'bg-primary-500/5' : ''}`}>
                    <td className="px-4 py-3">
                      {i === 0 ? <Medal size={14} className="text-yellow-400" /> :
                       i === 1 ? <Medal size={14} className="text-dark-400" /> :
                       i === 2 ? <Medal size={14} className="text-amber-700" /> :
                       <span className="text-dark-500 text-sm">{i + 1}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-white text-xs font-bold">
                          {player.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-medium">{player.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-400 text-xs">{player.position?.slice(0, 3)}</td>
                    <td className="px-4 py-3 text-center text-primary-400 font-bold text-sm">{player.goals || 0}</td>
                    <td className="px-4 py-3 text-center text-amber-400 font-bold text-sm">{player.assists || 0}</td>
                    <td className="px-4 py-3 text-center text-white font-bold text-sm">
                      {(player.goals || 0) + (player.assists || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {players.length === 0 && (
        <div className="glass flex flex-col items-center justify-center py-16 text-center">
          <Goal size={40} className="text-dark-600 mb-3" />
          <p className="text-dark-400">Add players and update their stats to see data here.</p>
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color }) {
  const c = {
    primary: 'text-primary-400',
    amber:   'text-amber-400',
    blue:    'text-blue-400',
    purple:  'text-purple-400',
  }
  return (
    <div className="glass p-4">
      <p className={`text-2xl font-bold ${c[color]}`}>{value}</p>
      <p className="text-dark-400 text-xs mt-0.5">{label}</p>
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
