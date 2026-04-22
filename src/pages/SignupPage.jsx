import { Trophy } from 'lucide-react'
import SignupForm from '../components/Auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center shadow-2xl shadow-primary-500/30 mb-4">
            <Trophy size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Create an account
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Start managing or join your football team
          </p>
        </div>

        {/* Form card */}
        <div className="glass p-6">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
