import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { getDeveloperDashboard } from '../api'

type ProfileTab = 'overview' | 'assessments' | 'skills' | 'timeline'

const tabItems: { id: ProfileTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'assessments', label: 'My Assessments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'skills', label: 'Skill Levels', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { id: 'timeline', label: 'Growth Timeline', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
]

export default function MyProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<ProfileTab>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getDeveloperDashboard(user.userId)
      .then(setProfileData)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const goBack = () => {
    if (user?.role === 'ROOT' || user?.role === 'TEAM_ADMIN') {
      navigate('/admin')
    } else {
      navigate('/developer')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-lg">Loading profile...</div>
      </div>
    )
  }

  const skillLevels = profileData?.skillLevels || []
  const attemptHistory = profileData?.attemptHistory || []
  const pendingInvites = profileData?.pendingInvites || []
  const timeline = profileData?.trajectoryTimeline || []

  const passedCount = attemptHistory.filter((a: any) => a.passed).length
  const failedCount = attemptHistory.filter((a: any) => !a.passed && a.status === 'COMPLETED').length
  const pendingReviewCount = attemptHistory.filter((a: any) => a.status === 'PENDING_REVIEW').length
  const avgScore = attemptHistory.length > 0
    ? Math.round(attemptHistory.reduce((sum: number, a: any) => sum + (a.totalQuestions > 0 ? (a.score / a.totalQuestions) * 100 : 0), 0) / attemptHistory.length)
    : 0

  const roleLabel = user?.role === 'ROOT' ? 'Root Admin' : user?.role === 'TEAM_ADMIN' ? 'Team Admin' : 'Developer'
  const roleBgClass = user?.role === 'ROOT' ? 'bg-purple-100 text-purple-700' : user?.role === 'TEAM_ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer lg:hidden"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">My Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:inline">{user?.fullName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline ${roleBgClass}`}>
              {roleLabel}
            </span>
            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-white border-r border-slate-200 flex-shrink-0 flex flex-col transition-all duration-200 ${sidebarCollapsed ? 'w-0 lg:w-16 overflow-hidden' : 'w-60'}`}>
          <nav className="flex-1 py-4 space-y-1 px-3">
            {tabItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarCollapsed(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  tab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <svg className={`w-5 h-5 flex-shrink-0 ${tab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                </svg>
                <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={`p-3 border-t border-slate-200 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 font-medium">Quick Stats</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Skills</span>
                  <span className="font-medium text-slate-700">{skillLevels.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Assessments</span>
                  <span className="font-medium text-slate-700">{attemptHistory.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Pass Rate</span>
                  <span className="font-medium text-slate-700">
                    {attemptHistory.length > 0 ? Math.round((passedCount / attemptHistory.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {tab === 'overview' && (
              <div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {user?.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900">{user?.fullName}</h2>
                      <p className="text-slate-500 mt-0.5">{user?.email}</p>
                      <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${roleBgClass}`}>
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-600">{skillLevels.length}</div>
                    <p className="text-sm text-slate-500 mt-1">Skills Tracked</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600">{passedCount}</div>
                    <p className="text-sm text-slate-500 mt-1">Passed</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-3xl font-bold text-amber-600">{pendingInvites.length}</div>
                    <p className="text-sm text-slate-500 mt-1">Pending Invites</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-3xl font-bold text-slate-700">{avgScore}%</div>
                    <p className="text-sm text-slate-500 mt-1">Avg Score</p>
                  </div>
                </div>

                {attemptHistory.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Assessments</h3>
                    <div className="space-y-3">
                      {attemptHistory.slice(0, 5).map((attempt: any) => (
                        <div key={attempt.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${attempt.passed ? 'bg-emerald-500' : attempt.status === 'PENDING_REVIEW' ? 'bg-amber-500' : 'bg-red-500'}`} />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{attempt.componentName}</p>
                              <p className="text-xs text-slate-500">{attempt.techStack} &middot; Level {attempt.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-700">{attempt.score}/{attempt.totalQuestions}</p>
                            <p className={`text-xs font-medium ${attempt.passed ? 'text-emerald-600' : attempt.status === 'PENDING_REVIEW' ? 'text-amber-600' : 'text-red-600'}`}>
                              {attempt.passed ? 'Passed' : attempt.status === 'PENDING_REVIEW' ? 'Under Review' : 'Failed'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {attemptHistory.length === 0 && skillLevels.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-slate-500">No assessments taken yet. Complete assessments to build your profile.</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'assessments' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">My Assessments</h2>
                <p className="text-sm text-slate-500 mb-6">Complete history of all assessments you've taken</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-indigo-700">{attemptHistory.length}</div>
                    <p className="text-xs text-indigo-600">Total</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-emerald-700">{passedCount}</div>
                    <p className="text-xs text-emerald-600">Passed</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-red-700">{failedCount}</div>
                    <p className="text-xs text-red-600">Failed</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-amber-700">{pendingReviewCount}</div>
                    <p className="text-xs text-amber-600">Under Review</p>
                  </div>
                </div>

                {attemptHistory.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-400">No assessments taken yet.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Component</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tech Stack</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Level</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Result</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attemptHistory.map((attempt: any) => (
                          <tr key={attempt.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-900">{attempt.componentName}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">{attempt.techStack}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                                {attempt.level}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-sm font-semibold text-slate-700">{attempt.score}/{attempt.totalQuestions}</span>
                              <span className="block text-xs text-slate-400">
                                {attempt.totalQuestions > 0 ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                attempt.passed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : attempt.status === 'PENDING_REVIEW'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                              }`}>
                                {attempt.passed ? 'Passed' : attempt.status === 'PENDING_REVIEW' ? 'Under Review' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-slate-600">
                                {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : '-'}
                              </p>
                              <p className="text-xs text-slate-400">
                                {attempt.startedAt ? new Date(attempt.startedAt).toLocaleTimeString() : ''}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {pendingInvites.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Invites</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pendingInvites.map((invite: any) => (
                        <div key={invite.id} className="bg-white rounded-xl border border-amber-200 p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{invite.componentName}</p>
                            <p className="text-xs text-slate-500">{invite.techStack} &middot; Level {invite.level}</p>
                          </div>
                          <button
                            onClick={() => navigate(`/assessment/${invite.id}`)}
                            className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                          >
                            Take Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'skills' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Skill Levels</h2>
                <p className="text-sm text-slate-500 mb-6">Your current skill ratings across components</p>

                {skillLevels.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-400">No skill levels recorded yet. Complete assessments to build your skills.</p>
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

            {tab === 'timeline' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Growth Timeline</h2>
                <p className="text-sm text-slate-500 mb-6">Your skill progression over time</p>

                {timeline.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-400">No timeline data yet. Pass assessments to see your growth.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                    <div className="space-y-6">
                      {timeline.map((entry: any, idx: number) => (
                        <div key={idx} className="relative flex items-start gap-4 pl-12">
                          <div className="absolute left-4 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow" style={{ top: '4px' }} />
                          <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900">{entry.componentName}</h4>
                                <p className="text-xs text-slate-500">{entry.techStack}</p>
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                Level {entry.levelReached}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span>Score: {entry.score}/{entry.totalQuestions}</span>
                              {entry.date && (
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
