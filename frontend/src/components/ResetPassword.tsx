import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSecurityQuestion, resetPassword } from '../api'

export default function ResetPassword() {
  const [step, setStep] = useState<'email' | 'answer'>('email')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGetQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await getSecurityQuestion(email)
      setQuestion(data.securityQuestion)
      setStep('answer')
    } catch (err: any) {
      setError(err.message || 'Failed to get security question')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try {
      await resetPassword(email, securityAnswer, newPassword)
      navigate('/', { state: { message: 'Password reset successfully. Please sign in.' } })
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-500 mt-1">
            {step === 'email' ? 'Enter your email to get started' : 'Answer your security question'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {step === 'email' ? (
            <form onSubmit={handleGetQuestion} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Security Question:</p>
                <p className="text-sm text-blue-700 mt-1">{question}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Answer</label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={e => setSecurityAnswer(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
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
