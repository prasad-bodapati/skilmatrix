import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { verify } from '../api'

export default function VerifyEmail() {
  const location = useLocation()
  const email = (location.state as any)?.email || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verify(email, code)
      navigate('/set-password', { state: { email } })
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
          <p className="text-slate-500 mt-1">Enter the verification code sent to {email || 'your email'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white text-center text-lg tracking-widest"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
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
