import { useState } from 'react'
import { X, Loader2, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function EditProfileModal({ onClose }) {
  const { user, profile, updateProfileName } = useAuth()
  
  // Local state initialized with current profile name
  const [name, setName] = useState(profile?.displayName || user?.displayName || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name cannot be empty')
      return
    }

    setLoading(true)
    setError('')
    try {
      await updateProfileName(name.trim())
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to update profile. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Edit Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Email Address (Read Only)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-dark-900 border border-white/5 rounded-xl text-dark-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-dark-300 text-xs font-medium mb-1.5 block">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
              autoFocus
              className="w-full px-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-dark-600"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || name.trim() === (profile?.displayName || user?.displayName)}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
