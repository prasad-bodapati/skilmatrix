import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import {
  getAdminDashboard,
  getPendingReviews,
  getUsers,
  getAssessments,
  getTeams,
  getProjects,
  getComponents,
  getQuestions,
  getSkillsMatrix,
  inviteUser,
  createAssessmentInvite,
  gradeAnswer,
} from '../api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'skills' | 'invite' | 'assessments' | 'reviews' | 'questions'>('overview')
  const [dashboard, setDashboard] = useState<any>(null)
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [selectedDev, setSelectedDev] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [invEmail, setInvEmail] = useState('')
  const [invName, setInvName] = useState('')
  const [invRole, setInvRole] = useState('DEVELOPER')
  const [invProjectId, setInvProjectId] = useState<number>(0)
  const [invMsg, setInvMsg] = useState('')

  const [aiDevId, setAiDevId] = useState<number>(0)
  const [aiAssessId, setAiAssessId] = useState<number>(0)
  const [aiMsg, setAiMsg] = useState('')

  const [teams, setTeams] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [components, setComponents] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedTeam, setSelectedTeam] = useState<number>(0)
  const [selectedProject, setSelectedProject] = useState<number>(0)
  const [selectedComponent, setSelectedComponent] = useState<number>(0)

  const [skillsMatrix, setSkillsMatrix] = useState<any>(null)
  const [skillsView, setSkillsView] = useState<'byComponent' | 'byProject' | 'byTeam'>('byComponent')
  const [expandedSkillCard, setExpandedSkillCard] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [d, r, u, a, t, sm] = await Promise.all([
        getAdminDashboard(),
        getPendingReviews(),
        getUsers(),
        getAssessments(),
        getTeams(),
        getSkillsMatrix(),
      ])
      setDashboard(d)
      setPendingReviews(r)
      setUsers(u)
      setAssessments(a)
      setTeams(t)
      setSkillsMatrix(sm)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (selectedTeam) {
      getProjects(selectedTeam).then(setProjects).catch(() => {})
      setSelectedProject(0)
      setComponents([])
      setQuestions([])
    }
  }, [selectedTeam])

  useEffect(() => {
    if (selectedProject) {
      getComponents(selectedProject).then(setComponents).catch(() => {})
      setSelectedComponent(0)
      setQuestions([])
    }
  }, [selectedProject])

  useEffect(() => {
    if (selectedComponent) {
      getQuestions(selectedComponent).then(setQuestions).catch(() => {})
    }
  }, [selectedComponent])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInvMsg('')
    try {
      await inviteUser(invEmail, invName, invRole, invProjectId)
      setInvMsg('User invited successfully!')
      setInvEmail('')
      setInvName('')
      loadData()
    } catch (err: any) {
      setInvMsg(`Error: ${err.message}`)
    }
  }

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setAiMsg('')
    try {
      await createAssessmentInvite(aiDevId, aiAssessId)
      setAiMsg('Assessment invite created!')
    } catch (err: any) {
      setAiMsg(`Error: ${err.message}`)
    }
  }

  const handleGrade = async (answerId: number, correct: boolean) => {
    try {
      await gradeAnswer(answerId, correct)
      const r = await getPendingReviews()
      setPendingReviews(r)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills Matrix' },
    { id: 'invite', label: 'Invite Users' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'reviews', label: 'Pending Reviews' },
    { id: 'questions', label: 'Questions' },
  ] as const

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-lg">Loading dashboard...</div>
      </div>
    )
  }

  const devs = users.filter(u => u.role === 'DEVELOPER')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {tab === 'overview' && dashboard && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Developers', value: dashboard.totalDevelopers, color: 'bg-blue-500' },
                { label: 'Teams', value: dashboard.totalTeams, color: 'bg-indigo-500' },
                { label: 'Projects', value: dashboard.totalProjects, color: 'bg-violet-500' },
                { label: 'Pending Reviews', value: dashboard.pendingReviews, color: 'bg-amber-500' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <div className={`mt-3 h-1 rounded-full ${stat.color} opacity-60`} style={{ width: '40%' }} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Team Ratings</h2>
              </div>
              {dashboard.teamRatings?.map((team: any) => (
                <div key={team.teamId} className="border-b border-slate-100 last:border-0">
                  <div className="px-5 py-3 bg-slate-50">
                    <h3 className="font-medium text-slate-800">{team.teamName}</h3>
                  </div>
                  {team.developers?.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {team.developers.map((dev: any) => (
                        <div key={dev.developerId}>
                          <button
                            onClick={() => setSelectedDev(selectedDev?.developerId === dev.developerId ? null : dev)}
                            className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer text-left"
                          >
                            <div>
                              <span className="font-medium text-slate-900">{dev.developerName}</span>
                              <span className="text-slate-400 ml-2 text-sm">{dev.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Avg Level:</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {dev.averageLevel}
                              </span>
                              <svg className={`w-4 h-4 text-slate-400 transition ${selectedDev?.developerId === dev.developerId ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          {selectedDev?.developerId === dev.developerId && (
                            <div className="px-5 pb-4">
                              <div className="bg-slate-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Component Skills</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {dev.skills?.map((skill: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3">
                                      <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="text-slate-700">{skill.component}</span>
                                          <span className="text-slate-500">L{skill.level}</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-indigo-500 rounded-full transition-all"
                                            style={{ width: `${(skill.level / 10) * 100}%` }}
                                          />
                                        </div>
                                      </div>
                                      <span className="text-xs text-slate-400 w-16 text-right">{skill.techStack}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-5 py-3 text-sm text-slate-400">No developers with ratings yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'skills' && skillsMatrix && (
          <div>
            <div className="flex gap-2 mb-6">
              {[
                { id: 'byComponent', label: 'By Component' },
                { id: 'byProject', label: 'By Project' },
                { id: 'byTeam', label: 'By Team' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSkillsView(v.id as any); setExpandedSkillCard(null) }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    skillsView === v.id ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {skillsView === 'byComponent' && (
              <div className="space-y-4">
                {skillsMatrix.byComponent?.map((comp: any) => (
                  <div key={comp.componentId} className="bg-white rounded-xl border border-slate-200">
                    <button
                      onClick={() => setExpandedSkillCard(expandedSkillCard === `c-${comp.componentId}` ? null : `c-${comp.componentId}`)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer text-left"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">{comp.componentName}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{comp.techStack} &middot; {comp.projectName} &middot; {comp.teamName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {comp.developers?.length || 0} developer{comp.developers?.length !== 1 ? 's' : ''}
                        </span>
                        <svg className={`w-4 h-4 text-slate-400 transition ${expandedSkillCard === `c-${comp.componentId}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedSkillCard === `c-${comp.componentId}` && (
                      <div className="px-5 pb-4 border-t border-slate-100">
                        <table className="w-full mt-3">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-2 text-sm font-medium text-slate-600">Developer</th>
                              <th className="text-left py-2 text-sm font-medium text-slate-600">Email</th>
                              <th className="text-left py-2 text-sm font-medium text-slate-600">Level</th>
                              <th className="text-left py-2 text-sm font-medium text-slate-600">Proficiency</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {comp.developers?.map((dev: any) => (
                              <tr key={dev.developerId}>
                                <td className="py-2.5 text-sm font-medium text-slate-900">{dev.developerName}</td>
                                <td className="py-2.5 text-sm text-slate-500">{dev.email}</td>
                                <td className="py-2.5">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    L{dev.level}
                                  </span>
                                </td>
                                <td className="py-2.5 w-40">
                                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-500 rounded-full"
                                      style={{ width: `${(dev.level / 10) * 100}%` }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
                {(!skillsMatrix.byComponent || skillsMatrix.byComponent.length === 0) && (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-400">No skill data available yet</p>
                  </div>
                )}
              </div>
            )}

            {skillsView === 'byProject' && (
              <div className="space-y-4">
                {skillsMatrix.byProject?.map((proj: any) => (
                  <div key={proj.projectId} className="bg-white rounded-xl border border-slate-200">
                    <button
                      onClick={() => setExpandedSkillCard(expandedSkillCard === `p-${proj.projectId}` ? null : `p-${proj.projectId}`)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer text-left"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">{proj.projectName}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Team: {proj.teamName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
                          {proj.developers?.length || 0} developer{proj.developers?.length !== 1 ? 's' : ''}
                        </span>
                        <svg className={`w-4 h-4 text-slate-400 transition ${expandedSkillCard === `p-${proj.projectId}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedSkillCard === `p-${proj.projectId}` && (
                      <div className="px-5 pb-4 border-t border-slate-100">
                        <div className="mt-3 space-y-4">
                          {proj.developers?.map((dev: any) => (
                            <div key={dev.developerId} className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="font-medium text-slate-900">{dev.developerName}</span>
                                  <span className="text-slate-400 ml-2 text-sm">{dev.email}</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                  Avg L{dev.averageLevel}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {dev.skills?.map((skill: any, i: number) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700">{skill.componentName}</span>
                                        <span className="text-slate-500">L{skill.level}</span>
                                      </div>
                                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-violet-500 rounded-full"
                                          style={{ width: `${(skill.level / 10) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                    <span className="text-xs text-slate-400 w-16 text-right">{skill.techStack}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(!skillsMatrix.byProject || skillsMatrix.byProject.length === 0) && (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-400">No skill data available yet</p>
                  </div>
                )}
              </div>
            )}

            {skillsView === 'byTeam' && (
              <div className="space-y-4">
                {skillsMatrix.byTeam?.map((team: any) => (
                  <div key={team.teamId} className="bg-white rounded-xl border border-slate-200">
                    <button
                      onClick={() => setExpandedSkillCard(expandedSkillCard === `t-${team.teamId}` ? null : `t-${team.teamId}`)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer text-left"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">{team.teamName}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                          {team.developers?.length || 0} developer{team.developers?.length !== 1 ? 's' : ''}
                        </span>
                        <svg className={`w-4 h-4 text-slate-400 transition ${expandedSkillCard === `t-${team.teamId}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedSkillCard === `t-${team.teamId}` && (
                      <div className="px-5 pb-4 border-t border-slate-100">
                        <div className="mt-3 space-y-4">
                          {team.developers?.map((dev: any) => (
                            <div key={dev.developerId} className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="font-medium text-slate-900">{dev.developerName}</span>
                                  <span className="text-slate-400 ml-2 text-sm">{dev.email}</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                  Avg L{dev.averageLevel}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {dev.skills?.map((skill: any, i: number) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700">{skill.componentName}</span>
                                        <span className="text-slate-500">L{skill.level}</span>
                                      </div>
                                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-emerald-500 rounded-full"
                                          style={{ width: `${(skill.level / 10) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                    <span className="text-xs text-slate-400 w-20 text-right">{skill.projectName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {(!team.developers || team.developers.length === 0) && (
                            <p className="text-sm text-slate-400 py-2">No developers with skills in this team yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'invite' && (
          <div className="max-w-lg">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-5">Invite a User</h2>
              {invMsg && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${invMsg.startsWith('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                  {invMsg}
                </div>
              )}
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={invName}
                    onChange={e => setInvName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invEmail}
                    onChange={e => setInvEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={invRole}
                    onChange={e => setInvRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="TEAM_ADMIN">Team Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project ID</label>
                  <input
                    type="number"
                    value={invProjectId || ''}
                    onChange={e => setInvProjectId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                  Send Invite
                </button>
              </form>
            </div>
          </div>
        )}

        {tab === 'assessments' && (
          <div className="space-y-6">
            <div className="max-w-lg">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-5">Create Assessment Invite</h2>
                {aiMsg && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${aiMsg.startsWith('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                    {aiMsg}
                  </div>
                )}
                <form onSubmit={handleCreateInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Developer</label>
                    <select
                      value={aiDevId}
                      onChange={e => setAiDevId(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                    >
                      <option value={0}>Select developer...</option>
                      {devs.map(d => (
                        <option key={d.id} value={d.id}>{d.fullName} ({d.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assessment</label>
                    <select
                      value={aiAssessId}
                      onChange={e => setAiAssessId(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                    >
                      <option value={0}>Select assessment...</option>
                      {assessments.map((a: any) => (
                        <option key={a.id} value={a.id}>
                          {a.componentName} ({a.techStack}) - Level {a.level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Create Invite
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">All Assessments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Component</th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Tech Stack</th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Level</th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Pass %</th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Questions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assessments.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-sm text-slate-900">{a.componentName}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{a.techStack}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Level {a.level}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">{a.passMarkPercentage}%</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{a.numberOfQuestions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Pending Reviews</h2>
            {pendingReviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400">No pending reviews</p>
              </div>
            ) : (
              pendingReviews.map((review: any) => (
                <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-slate-900">{review.developerName}</h3>
                      <p className="text-sm text-slate-500">{review.componentName} - Level {review.level}</p>
                    </div>
                    <span className="text-sm text-slate-600">
                      Score: {review.score}/{review.totalQuestions}
                    </span>
                  </div>
                  {review.unreviewedAnswers?.map((answer: any) => (
                    <div key={answer.id} className="border border-slate-200 rounded-lg p-4 mb-3">
                      <p className="text-sm font-medium text-slate-800 mb-2">{answer.questionText}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        <div className="text-sm">
                          <span className="text-slate-500">Given: </span>
                          <span className="text-slate-900 font-medium">{answer.givenAnswer}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500">Expected: </span>
                          <span className="text-slate-900 font-medium">{answer.correctAnswer}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGrade(answer.id, true)}
                          className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer"
                        >
                          Correct
                        </button>
                        <button
                          onClick={() => handleGrade(answer.id, false)}
                          className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition cursor-pointer"
                        >
                          Incorrect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'questions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Question Management</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team</label>
                  <select
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                  >
                    <option value={0}>Select team...</option>
                    {teams.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                  <select
                    value={selectedProject}
                    onChange={e => setSelectedProject(Number(e.target.value))}
                    disabled={!selectedTeam}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white disabled:opacity-50"
                  >
                    <option value={0}>Select project...</option>
                    {projects.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Component</label>
                  <select
                    value={selectedComponent}
                    onChange={e => setSelectedComponent(Number(e.target.value))}
                    disabled={!selectedProject}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white disabled:opacity-50"
                  >
                    <option value={0}>Select component...</option>
                    {components.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {questions.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-5 border-b border-slate-200">
                  <h3 className="font-medium text-slate-900">
                    Questions ({questions.length})
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {questions.map((q: any) => (
                    <div key={q.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 font-medium">{q.questionText}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {q.type}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              Level {q.difficultyLevel}
                            </span>
                          </div>
                          {q.options && q.options.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {q.options.map((opt: string, i: number) => (
                                <span key={i} className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? 'bg-green-100 text-green-800 font-medium' : 'bg-slate-100 text-slate-600'}`}>
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                          {(!q.options || q.options.length === 0) && (
                            <p className="mt-1 text-xs text-slate-500">Answer: {q.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedComponent > 0 && questions.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400">No questions for this component</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
