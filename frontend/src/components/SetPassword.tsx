import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { setPassword } from '../api'

export default function SetPassword() {
  const location = useLocation()
  const email = (location.state as any)?.email || ''
  const [password, setPass] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try {
      await setPassword(email, password, securityQuestion, securityAnswer)
      navigate('/', { state: { message: 'Password set successfully. Please sign in.' } })
    } catch (err: any) {
      setError(err.message || 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Set Your Password</h1>
          <p className="text-slate-500 mt-1">Create a password and security question</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPass(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Question</label>
              <input
                type="text"
                value={securityQuestion}
                onChange={e => setSecurityQuestion(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                placeholder="e.g., What is your pet's name?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Answer</label>
              <input
                type="text"
                value={securityAnswer}
                onChange={e => setSecurityAnswer(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                placeholder="Your answer"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Setting password...' : 'Set Password'}
            </button>
          </form>
          <div className="mt-5 text-center text-sm">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
