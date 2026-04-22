import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          id="login-email"
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
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-dark-400 text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  )
}

function friendlyError(code) {
  const map = {
    'auth/invalid-credential':      'Invalid email or password.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password.',
    'auth/too-many-requests':       'Too many attempts. Try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
