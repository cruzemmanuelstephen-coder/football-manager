import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Load or create a user profile document in Firestore
        const ref  = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProfile(snap.data())
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // ── Sign Up ─────────────────────────────────────────────────
  async function signUp(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    const profileData = {
      uid:         cred.user.uid,
      email,
      displayName,
      role:        null,
      teamId:      null,
      createdAt:   serverTimestamp(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), profileData)
    setProfile(profileData)
    return cred
  }

  // ── Login ────────────────────────────────────────────────────
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // ── Logout ───────────────────────────────────────────────────
  async function logout() {
    await signOut(auth)
  }

  // ── Update Profile Role & Team ──────────────────────────────
  async function updateTeamAndRole(teamId, role) {
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), { teamId, role }, { merge: true })
    setProfile(prev => ({ ...prev, teamId, role }))
  }

  // ── Join Existing Team ──────────────────────────────────────
  async function joinTeam(teamId) {
    if (!user) return
    // Check if team exists
    const teamSnap = await getDoc(doc(db, 'teams', teamId))
    if (!teamSnap.exists()) throw new Error('Invalid Team Code')

    // Add to roster
    await setDoc(doc(db, 'teams', teamId, 'players', user.uid), {
      name: profile?.displayName || user.displayName,
      position: 'Unknown',
      number: '',
      goals: 0,
      assists: 0,
      createdAt: serverTimestamp(),
    })

    // Update profile
    await updateTeamAndRole(teamId, 'player')
  }

  // ── Update Profile Name ─────────────────────────────────────
  async function updateProfileName(newName) {
    if (!user) return

    // 1. Update core Firebase Auth
    await updateProfile(user, { displayName: newName })

    // 2. Update users collection
    await setDoc(doc(db, 'users', user.uid), { displayName: newName }, { merge: true })

    // 3. Update team associations if they belong to one
    if (profile?.teamId) {
      if (profile.role === 'admin') {
        await setDoc(doc(db, 'teams', profile.teamId), { adminName: newName }, { merge: true })
      } else if (profile.role === 'player') {
        await setDoc(doc(db, 'teams', profile.teamId, 'players', user.uid), { name: newName }, { merge: true })
      }
    }

    // 4. Update local profile state
    setProfile(prev => prev ? { ...prev, displayName: newName } : null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, login, logout, updateTeamAndRole, joinTeam, updateProfileName }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
