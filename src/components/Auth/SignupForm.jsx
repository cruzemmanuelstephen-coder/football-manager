import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function SignupForm() {
  const { signUp } = useAuth()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await signUp(email, password, name)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          id="signup-name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="input pl-10"
        />
      </div>

      <div className="relative">
        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          id="signup-email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input pl-10"
        />
      </div>

      <div className="relative">
        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          id="signup-password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="input pl-10"
        />
      </div>

      <div className="relative">
        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          id="signup-confirm"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="input pl-10"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-dark-400 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password is too weak.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
