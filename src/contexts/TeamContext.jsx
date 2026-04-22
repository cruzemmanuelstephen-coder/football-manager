import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'

const TeamContext = createContext(null)

export function TeamProvider({ children }) {
  const { user, profile, updateTeamAndRole } = useAuth()

  const [team,     setTeam]     = useState(null)
  const [players,  setPlayers]  = useState([])
  const [matches,  setMatches]  = useState([])
  const [loading,  setLoading]  = useState(true)

  const teamId = profile?.teamId

  // ── Subscribe to team data when teamId changes ─────────────
  useEffect(() => {
    if (!teamId) {
      setTeam(null); setPlayers([]); setMatches([]); setLoading(false)
      return
    }
    setLoading(true)

    // Team doc
    const teamRef  = doc(db, 'teams', teamId)
    const unsubTeam = onSnapshot(teamRef, snap => {
      setTeam(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    }, err => {
      console.error('Error fetching team:', err)
      setLoading(false)
    })

    // Players sub-collection
    const playersQ = query(collection(db, 'teams', teamId, 'players'), orderBy('name'))
    const unsubPlayers = onSnapshot(playersQ, snap => {
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }, err => console.error('Error fetching players:', err))

    // Matches sub-collection
    const matchesQ = query(collection(db, 'teams', teamId, 'matches'), orderBy('date', 'desc'))
    const unsubMatches = onSnapshot(matchesQ, snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, err => {
      console.error('Error fetching matches:', err)
      setLoading(false)
    })

    return () => { unsubTeam(); unsubPlayers(); unsubMatches() }
  }, [teamId])

  // ── Create Team ───────────────────────────────────────────────
  async function createTeam(name) {
    const ref = await addDoc(collection(db, 'teams'), {
      name,
      adminId:   user.uid,
      adminName: user.displayName || profile?.displayName || 'Admin',
      createdAt: serverTimestamp(),
    })
    await updateTeamAndRole(ref.id, 'admin')
    return ref.id
  }

  // ── Players CRUD ─────────────────────────────────────────────
  async function addPlayer(data) {
    return addDoc(collection(db, 'teams', teamId, 'players'), {
      ...data,
      goals:     0,
      assists:   0,
      createdAt: serverTimestamp(),
    })
  }

  async function updatePlayer(playerId, data) {
    return updateDoc(doc(db, 'teams', teamId, 'players', playerId), data)
  }

  async function deletePlayer(playerId) {
    return deleteDoc(doc(db, 'teams', teamId, 'players', playerId))
  }

  // ── Matches CRUD ─────────────────────────────────────────────
  async function addMatch(data) {
    return addDoc(collection(db, 'teams', teamId, 'matches'), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }

  async function updateMatch(matchId, data) {
    return updateDoc(doc(db, 'teams', teamId, 'matches', matchId), data)
  }

  async function deleteMatch(matchId) {
    return deleteDoc(doc(db, 'teams', teamId, 'matches', matchId))
  }

  // ── Attendance & Stats ─────────────────────────────────────────
  async function getAttendance(matchId) {
    const snap = await getDocs(collection(db, 'teams', teamId, 'matches', matchId, 'attendance'))
    return snap.docs.map(d => ({ playerId: d.id, ...d.data() }))
  }

  async function setAttendance(matchId, playerId, available) {
    return setDoc(
      doc(db, 'teams', teamId, 'matches', matchId, 'attendance', playerId),
      { available, respondedAt: serverTimestamp() },
      { merge: true }
    )
  }

  async function saveMatchStats(matchId, updates) {
    const promises = updates.map(async (update) => {
      const { playerId, goals, assists, deltaGoals, deltaAssists } = update
      
      // Update the match attendance document
      await setDoc(
        doc(db, 'teams', teamId, 'matches', matchId, 'attendance', playerId),
        { goals, assists },
        { merge: true }
      )

      // Update the player's total stats if there's a difference
      if (deltaGoals !== 0 || deltaAssists !== 0) {
        await updateDoc(doc(db, 'teams', teamId, 'players', playerId), {
          goals: increment(deltaGoals),
          assists: increment(deltaAssists)
        })
      }
    })

    await Promise.all(promises)
  }

  return (
    <TeamContext.Provider value={{
      team, players, matches, loading,
      createTeam,
      addPlayer, updatePlayer, deletePlayer,
      addMatch, updateMatch, deleteMatch,
      getAttendance, setAttendance, saveMatchStats,
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be inside TeamProvider')
  return ctx
}
