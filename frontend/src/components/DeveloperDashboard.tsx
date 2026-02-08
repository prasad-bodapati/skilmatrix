import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { getDeveloperDashboard } from '../api'

export default function DeveloperDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'skills' | 'invites' | 'history' | 'timeline'>('skills')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getDeveloperDashboard(user.userId)
      .then(setDashboard)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-lg">Loading dashboard...</div>
      </div>
    )
  }

  const skillLevels = dashboard?.skillLevels || []
  const pendingInvites = dashboard?.pendingInvites || []
  const attemptHistory = dashboard?.attemptHistory || []
  const timeline = dashboard?.trajectoryTimeline || []

  const tabs = [
    { id: 'skills', label: 'My Skills' },
    { id: 'invites', label: `Invites (${pendingInvites.length})` },
    { id: 'history', label: 'History' },
    { id: 'timeline', label: 'Timeline' },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Developer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.fullName}</span>
            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-slate-200 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'skills' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Current Skill Levels</h2>
            {skillLevels.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400">No skill levels recorded yet. Complete assessments to build your profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillLevels.map((skill: any) => (
                  <div key={skill.componentId} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-slate-900">{skill.componentName}</h3>
                        <p className="text-sm text-slate-500">{skill.projectName} &middot; {skill.techStack}</p>
                      </div>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg">
                        {skill.currentLevel}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(skill.currentLevel / 10) * 100}%`,
                            background: `linear-gradient(90deg, #6366f1, #4f46e5)`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-400">Level 0</span>
                        <span className="text-xs text-slate-400">Level 10</span>
                      </div>
                    </div>
                    {skill.lastLevelUpAt && (
                      <p className="text-xs text-slate-400 mt-2">
                        Last leveled up: {new Date(skill.lastLevelUpAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'invites' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Pending Assessment Invites</h2>
            {pendingInvites.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400">No pending invites</p>
              </div>
            ) : (
              pendingInvites.map((invite: any) => (
                <div key={invite.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{invite.componentName}</h3>
                    <p className="text-sm text-slate-500">{invite.techStack} &middot; Level {invite.level}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Invited: {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/assessment/${invite.id}`)}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Take Assessment
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Assessment History</h2>
            {attemptHistory.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400">No past attempts</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Component</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Level</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Score</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Status</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attemptHistory.map((attempt: any) => (
                        <tr key={attempt.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3">
                            <div className="text-sm text-slate-900 font-medium">{attempt.componentName}</div>
                            <div className="text-xs text-slate-500">{attempt.techStack}</div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Level {attempt.level}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-900">{attempt.score}/{attempt.totalQuestions}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              attempt.passed
                                ? 'bg-green-100 text-green-800'
                                : attempt.status === 'PENDING_REVIEW'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {attempt.passed ? 'Passed' : attempt.status === 'PENDING_REVIEW' ? 'Under Review' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-500">
                            {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'timeline' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Skill Trajectory Timeline</h2>
            {timeline.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400">No level-up events recorded yet. Pass assessments to see your progression.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200" />
                  <div className="space-y-8">
                    {timeline.map((event: any, index: number) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-2.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow" />
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <h4 className="font-medium text-slate-900">{event.componentName}</h4>
                              <p className="text-sm text-slate-500">{event.techStack}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                                Level {event.levelReached}
                              </span>
                              <span className="text-sm text-green-600 font-medium">
                                {event.score}/{event.totalQuestions}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }) : 'Date not available'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
