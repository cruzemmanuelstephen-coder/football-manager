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
      role:        'coach',
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

  // ── Update teamId on profile ──────────────────────────────────
  async function updateTeamId(teamId) {
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), { teamId }, { merge: true })
    setProfile(prev => ({ ...prev, teamId }))
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, login, logout, updateTeamId }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
