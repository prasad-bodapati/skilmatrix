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
  getDeveloperDashboard,

  createAssessmentInvite,
  gradeAnswer,
} from '../api'

type SidebarTab = 'overview' | 'projects' | 'teams' | 'assessments'

const sidebarItems: { id: SidebarTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'projects', label: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  { id: 'teams', label: 'Teams', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'assessments', label: 'Assessments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<SidebarTab>('overview')
  const [dashboard, setDashboard] = useState<any>(null)
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
  const [expandedSkillCard, setExpandedSkillCard] = useState<string | null>(null)

  const [projectsSubTab, setProjectsSubTab] = useState<'all' | 'skills' | 'questions'>('all')
  const [teamsView, setTeamsView] = useState<'list' | 'team' | 'developer'>('list')
  const [selectedTeamData, setSelectedTeamData] = useState<any>(null)
  const [selectedDevDetail, setSelectedDevDetail] = useState<any>(null)
  const [selectedDevDashboard, setSelectedDevDashboard] = useState<any>(null)
  const [devSearchQuery, setDevSearchQuery] = useState('')
  const [loadingDevDetail, setLoadingDevDetail] = useState(false)
  const [inviteComponent, setInviteComponent] = useState<number>(0)
  const [inviteLevel, setInviteLevel] = useState<number>(0)
  const [inviteMsg, setInviteMsg] = useState('')
  const [assessmentsSubTab, setAssessmentsSubTab] = useState<'list' | 'create' | 'reviews'>('list')

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  const handleSelectTeam = (team: any) => {
    setSelectedTeamData(team)
    setTeamsView('team')
    setDevSearchQuery('')
    setSelectedDevDetail(null)
    setSelectedDevDashboard(null)
  }

  const handleSelectDev = async (dev: any) => {
    setSelectedDevDetail(dev)
    setTeamsView('developer')
    setLoadingDevDetail(true)
    setInviteComponent(0)
    setInviteLevel(0)
    setInviteMsg('')
    try {
      const dd = await getDeveloperDashboard(dev.developerId)
      setSelectedDevDashboard(dd)
    } catch {
      setSelectedDevDashboard(null)
    } finally {
      setLoadingDevDetail(false)
    }
  }

  const handleTeamsBack = () => {
    if (teamsView === 'developer') {
      setTeamsView('team')
      setSelectedDevDetail(null)
      setSelectedDevDashboard(null)
    } else {
      setTeamsView('list')
      setSelectedTeamData(null)
    }
  }

  const handleSendAssessmentInvite = async () => {
    if (!selectedDevDetail || !inviteComponent || !inviteLevel) return
    setInviteMsg('')
    const matchingAssessment = assessments.find(
      (a: any) => a.componentId === inviteComponent && a.level === inviteLevel
    )
    if (!matchingAssessment) {
      setInviteMsg('No assessment found for this component and level combination.')
      return
    }
    try {
      await createAssessmentInvite(selectedDevDetail.developerId, matchingAssessment.id)
      setInviteMsg('Assessment invite sent successfully!')
      setInviteComponent(0)
      setInviteLevel(0)
    } catch (err: any) {
      setInviteMsg(`Error: ${err.message}`)
    }
  }

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

  const devs = users.filter(u => u.role === 'DEVELOPER')

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
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Skill Matrix</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer" title="My Profile">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-slate-600 hidden sm:inline">{user?.fullName}</span>
            </button>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium hidden sm:inline">
              {user?.role === 'ROOT' ? 'Root Admin' : 'Team Admin'}
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
            {sidebarItems.map(item => (
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
                {item.id === 'assessments' && pendingReviews.length > 0 && (
                  <span className={`ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                    {pendingReviews.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className={`p-3 border-t border-slate-200 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 font-medium">Quick Stats</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Developers</span>
                  <span className="font-medium text-slate-700">{dashboard?.totalDevelopers || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Teams</span>
                  <span className="font-medium text-slate-700">{dashboard?.totalTeams || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Projects</span>
                  <span className="font-medium text-slate-700">{dashboard?.totalProjects || 0}</span>
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

            {tab === 'overview' && dashboard && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Developers', value: dashboard.totalDevelopers, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
                    { label: 'Teams', value: dashboard.totalTeams, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
                    { label: 'Projects', value: dashboard.totalProjects, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'bg-violet-500', lightColor: 'bg-violet-50', textColor: 'text-violet-600' },
                    { label: 'Pending Reviews', value: dashboard.pendingReviews, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-600' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${stat.lightColor} rounded-lg flex items-center justify-center`}>
                          <svg className={`w-5 h-5 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={stat.icon} />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="p-5 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {pendingReviews.length > 0 ? (
                      pendingReviews.slice(0, 3).map((review: any) => (
                        <div key={review.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{review.developerName} - {review.componentName}</p>
                            <p className="text-xs text-slate-500">Pending review &middot; Level {review.level}</p>
                          </div>
                          <button
                            onClick={() => { setTab('assessments'); setAssessmentsSubTab('reviews') }}
                            className="text-xs text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer whitespace-nowrap"
                          >
                            Review
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-4">No pending reviews</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
                  <div className="flex gap-1 bg-white rounded-lg p-1 border border-slate-200">
                    {[
                      { id: 'all', label: 'All Projects' },
                      { id: 'skills', label: 'Skills Matrix' },
                      { id: 'questions', label: 'Questions' },
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setProjectsSubTab(st.id as any)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                          projectsSubTab === st.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {projectsSubTab === 'all' && skillsMatrix && (
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
                                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(skill.level / 10) * 100}%` }} />
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
                        <p className="text-slate-400">No projects available</p>
                      </div>
                    )}
                  </div>
                )}

                {projectsSubTab === 'skills' && skillsMatrix && (
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
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(dev.level / 10) * 100}%` }} />
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

                {projectsSubTab === 'questions' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          <h3 className="font-medium text-slate-900">Questions ({questions.length})</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {questions.map((q: any) => (
                            <div key={q.id} className="p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-sm text-slate-900 font-medium">{q.questionText}</p>
                                  <div className="mt-2 flex gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{q.type}</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">Level {q.difficultyLevel}</span>
                                  </div>
                                  {q.options && q.options.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {q.options.map((opt: string, i: number) => (
                                        <span key={i} className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? 'bg-green-100 text-green-800 font-medium' : 'bg-slate-100 text-slate-600'}`}>{opt}</span>
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
            )}

            {tab === 'teams' && (
              <div>
                {teamsView === 'list' && (
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Teams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboard?.teamRatings?.map((team: any) => {
                        const teamInfo = teams.find((t: any) => t.id === team.teamId)
                        return (
                          <button
                            key={team.teamId}
                            onClick={() => handleSelectTeam(team)}
                            className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{team.teamName}</h3>
                            {teamInfo?.description && (
                              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{teamInfo.description}</p>
                            )}
                            <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">{team.developers?.length || 0}</span>
                                <span className="text-sm text-slate-500">developers</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">{teamInfo?.projectCount || 0}</span>
                                <span className="text-sm text-slate-500">projects</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {teamsView === 'team' && selectedTeamData && (() => {
                  const filteredDevs = (selectedTeamData.developers || []).filter((dev: any) => {
                    if (!devSearchQuery) return true
                    const q = devSearchQuery.toLowerCase()
                    return dev.developerName?.toLowerCase().includes(q) || dev.email?.toLowerCase().includes(q)
                  })
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <button onClick={handleTeamsBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                        </button>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{selectedTeamData.teamName}</h2>
                          <p className="text-sm text-slate-500">{filteredDevs.length} developer{filteredDevs.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="mb-5">
                        <div className="relative max-w-md">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search developers..."
                            value={devSearchQuery}
                            onChange={e => setDevSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white text-sm"
                          />
                        </div>
                      </div>

                      {filteredDevs.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                          <p className="text-slate-400">No developers found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredDevs.map((dev: any) => (
                            <button
                              key={dev.developerId}
                              onClick={() => handleSelectDev(dev)}
                              className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-300 hover:shadow-sm transition cursor-pointer group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {dev.developerName?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 truncate">{dev.developerName}</p>
                                  <p className="text-sm text-slate-500 truncate">{dev.email}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    Avg L{dev.averageLevel}
                                  </span>
                                  <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                              {dev.skills?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {dev.skills.slice(0, 4).map((skill: any, i: number) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                      {skill.component} L{skill.level}
                                    </span>
                                  ))}
                                  {dev.skills.length > 4 && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                                      +{dev.skills.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {teamsView === 'developer' && selectedDevDetail && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <button onClick={handleTeamsBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {selectedDevDetail.developerName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{selectedDevDetail.developerName}</h2>
                          <p className="text-sm text-slate-500">{selectedDevDetail.email}</p>
                        </div>
                      </div>
                    </div>

                    {loadingDevDetail ? (
                      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                        <p className="text-slate-500">Loading developer details...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3">Component Skills</h3>
                          {(selectedDevDashboard?.skillLevels || []).length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                              <p className="text-slate-400 text-sm">No skills recorded yet.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(selectedDevDashboard?.skillLevels || []).map((skill: any) => (
                                <div key={skill.componentId} className="bg-white rounded-xl border border-slate-200 p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-medium text-slate-900 text-sm">{skill.componentName}</p>
                                      <p className="text-xs text-slate-500">{skill.projectName} &middot; {skill.techStack}</p>
                                    </div>
                                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                                      {skill.currentLevel}
                                    </span>
                                  </div>
                                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(skill.currentLevel / 10) * 100}%` }} />
                                  </div>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs text-slate-400">Level 0</span>
                                    <span className="text-xs text-slate-400">Level 10</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3">Assessment History</h3>
                          {(selectedDevDashboard?.attemptHistory || []).length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                              <p className="text-slate-400 text-sm">No assessments taken yet.</p>
                            </div>
                          ) : (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Component</th>
                                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 uppercase">Level</th>
                                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 uppercase">Result</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(selectedDevDashboard?.attemptHistory || []).map((attempt: any) => (
                                    <tr key={attempt.id} className="hover:bg-slate-50">
                                      <td className="px-4 py-2.5">
                                        <p className="text-sm font-medium text-slate-900">{attempt.componentName}</p>
                                        <p className="text-xs text-slate-500">{attempt.techStack}</p>
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                                          {attempt.level}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 text-center text-sm font-medium text-slate-700">
                                        {attempt.score}/{attempt.totalQuestions}
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          attempt.passed ? 'bg-emerald-100 text-emerald-700' : attempt.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                          {attempt.passed ? 'Passed' : attempt.status === 'PENDING_REVIEW' ? 'Review' : 'Failed'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 text-sm text-slate-600">
                                        {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3">Send Assessment Invite</h3>
                          <div className="bg-white rounded-xl border border-slate-200 p-5">
                            {inviteMsg && (
                              <div className={`mb-4 p-3 rounded-lg text-sm ${inviteMsg.startsWith('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                                {inviteMsg}
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Component</label>
                                <select
                                  value={inviteComponent}
                                  onChange={e => { setInviteComponent(Number(e.target.value)); setInviteLevel(0) }}
                                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white text-sm"
                                >
                                  <option value={0}>Select component...</option>
                                  {Array.from(new Map(assessments.map((a: any) => [a.componentId, { id: a.componentId, name: a.componentName, techStack: a.techStack }])).values()).map((comp: any) => (
                                    <option key={comp.id} value={comp.id}>{comp.name} ({comp.techStack})</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Skill Level</label>
                                <select
                                  value={inviteLevel}
                                  onChange={e => setInviteLevel(Number(e.target.value))}
                                  disabled={!inviteComponent}
                                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                  <option value={0}>Select level...</option>
                                  {assessments
                                    .filter((a: any) => a.componentId === inviteComponent)
                                    .sort((a: any, b: any) => a.level - b.level)
                                    .map((a: any) => (
                                      <option key={a.id} value={a.level}>Level {a.level}</option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                            <button
                              onClick={handleSendAssessmentInvite}
                              disabled={!inviteComponent || !inviteLevel}
                              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                              Send Invite
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === 'assessments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Assessments</h2>
                  <div className="flex gap-1 bg-white rounded-lg p-1 border border-slate-200">
                    {[
                      { id: 'list', label: 'All Assessments' },
                      { id: 'create', label: 'Create Invite' },
                      { id: 'reviews', label: `Reviews (${pendingReviews.length})` },
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setAssessmentsSubTab(st.id as any)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                          assessmentsSubTab === st.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {assessmentsSubTab === 'list' && (
                  <div className="bg-white rounded-xl border border-slate-200">
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
                )}

                {assessmentsSubTab === 'create' && (
                  <div className="max-w-lg">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-5">Create Assessment Invite</h3>
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
                )}

                {assessmentsSubTab === 'reviews' && (
                  <div className="space-y-4">
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
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
