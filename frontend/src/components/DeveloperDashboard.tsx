import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { getDeveloperDashboard } from '../api'
import '../cockpit.css'
import {
  Activity,
  BarChart2,
  Box,
  Clock,
  Code2,
  Cpu,
  Database,
  Globe,
  History,
  Inbox,
  Layout,
  Terminal,
  Zap,
  User,
  LogOut,
  Server,
  Layers,
} from 'lucide-react'

type SidebarTab = 'skills' | 'invites' | 'history' | 'timeline'

function getSkillIcon(techStack: string) {
  const s = (techStack || '').toLowerCase()
  if (s.includes('react') || s.includes('frontend') || s.includes('vue') || s.includes('angular')) return Layout
  if (s.includes('postgres') || s.includes('mysql') || s.includes('mongo') || s.includes('db')) return Database
  if (s.includes('java') || s.includes('spring') || s.includes('backend') || s.includes('node')) return Terminal
  if (s.includes('python')) return Code2
  if (s.includes('aws') || s.includes('cloud') || s.includes('devops')) return Server
  if (s.includes('api') || s.includes('rest') || s.includes('graphql')) return Globe
  return Layers
}

function Gauge({ skill, index }: { skill: any; index: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100 + index * 150)
    return () => clearTimeout(t)
  }, [index])

  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const level = skill.currentLevel ?? 0
  const maxLevel = 10
  const targetOffset = circumference - (level / maxLevel) * circumference
  const offset = mounted ? targetOffset : circumference
  const Icon = getSkillIcon(skill.techStack || '')

  return (
    <div className="flex flex-col items-center p-6 rounded-xl border relative overflow-hidden group"
      style={{ background: '#111', borderColor: '#222' }}>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#444] group-hover:border-[#39ff14] transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#444] group-hover:border-[#39ff14] transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#444] group-hover:border-[#39ff14] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#444] group-hover:border-[#39ff14] transition-colors" />

      <div className="flex items-center gap-2 mb-6 w-full">
        <Icon className="w-5 h-5" style={{ color: '#888' }} />
        <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#f0f0f0' }}>
          {skill.componentName}
        </span>
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#222" strokeWidth={strokeWidth} />
          <circle
            className="cockpit-gauge-circle"
            cx={size / 2} cy={size / 2} r={radius}
            fill="transparent"
            stroke="#39ff14"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.4))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono text-white font-bold leading-none tracking-tighter"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
            {level}
          </span>
          <span className="text-xs font-mono mt-1 tracking-widest uppercase" style={{ color: '#888' }}>
            / {maxLevel}
          </span>
        </div>
      </div>

      <div className="mt-6 w-full space-y-2">
        <div className="flex justify-between items-center text-xs font-mono uppercase" style={{ color: '#888' }}>
          <span>Sys.Context</span>
          <span className="truncate ml-2 text-right" style={{ color: '#39ff14' }}>
            {skill.projectName} · {skill.techStack}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function DeveloperDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<SidebarTab>('skills')

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

  const skillLevels: any[] = dashboard?.skillLevels || []
  const pendingInvites: any[] = dashboard?.pendingInvites || []
  const attemptHistory: any[] = dashboard?.attemptHistory || []
  const timeline: any[] = dashboard?.trajectoryTimeline || []

  const avgLevel = skillLevels.length
    ? (skillLevels.reduce((s: number, sk: any) => s + (sk.currentLevel ?? 0), 0) / skillLevels.length).toFixed(2)
    : '0.00'

  const lastLevelUpDays = (() => {
    const dates = skillLevels.filter((s: any) => s.lastLevelUpAt).map((s: any) => new Date(s.lastLevelUpAt).getTime())
    if (!dates.length) return '—'
    const latest = Math.max(...dates)
    return Math.floor((Date.now() - latest) / 86400000)
  })()

  const primaryProject = skillLevels[0]?.projectName?.split(' ')[0] ?? '—'

  const overallReadiness = skillLevels.length
    ? Math.round((skillLevels.reduce((s: number, sk: any) => s + (sk.currentLevel ?? 0), 0) / (skillLevels.length * 10)) * 100)
    : 0

  const operatorName = user?.fullName
    ? user.fullName.split(' ')[0].toUpperCase() + '_' + String(user.userId).padStart(2, '0')
    : 'OPERATOR'

  if (loading) {
    return (
      <div className="cockpit-dashboard min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: '#888' }}>
            Initializing telemetry...
          </div>
          <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: '#222' }}>
            <div className="h-full animate-pulse" style={{ background: '#39ff14', width: '60%', boxShadow: '0 0 8px rgba(57,255,20,0.5)' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cockpit-dashboard flex h-screen overflow-hidden" style={{ userSelect: 'auto' }}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col z-10 relative" style={{ background: '#050505', borderRight: '1px solid #222' }}>
        <div className="p-6" style={{ borderBottom: '1px solid #222' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center text-black font-bold font-mono text-xs"
              style={{ background: '#39ff14' }}>
              OP
            </div>
            <div>
              <div className="text-sm font-bold tracking-widest uppercase">{operatorName}</div>
              <div className="text-xs font-mono" style={{ color: '#888' }}>SYS.ONLINE</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: '#666' }}>
            Navigation
          </div>
          <nav className="space-y-1">
            {([
              { id: 'skills', label: 'My Skills', Icon: Activity },
              { id: 'invites', label: 'Invites', Icon: Inbox, badge: pendingInvites.length },
              { id: 'history', label: 'History', Icon: History },
              { id: 'timeline', label: 'Timeline', Icon: Clock },
            ] as const).map(({ id, label, Icon, badge }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`cockpit-nav-item w-full flex items-center gap-3 px-6 py-3 text-sm text-left cursor-pointer${tab === id ? ' active' : ''}`}
                style={tab !== id ? { color: '#888' } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono uppercase tracking-wider">{label}</span>
                {badge != null && badge > 0 && (
                  <span className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#222' }}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-4 mt-8 mb-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: '#666' }}>
            System Status
          </div>
          <div className="px-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono" style={{ color: '#888' }}>Overall Readiness</span>
                <span className="font-mono" style={{ color: '#39ff14' }}>{overallReadiness}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: '#222' }}>
                <div className="h-full rounded-full" style={{
                  width: `${overallReadiness}%`,
                  background: '#39ff14',
                  boxShadow: '0 0 8px rgba(57,255,20,0.5)'
                }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono" style={{ color: '#888' }}>Assessment Quota</span>
                <span className="font-mono text-white">{attemptHistory.length}/{Math.max(attemptHistory.length, 1) * 3}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: '#222' }}>
                <div className="h-full rounded-full bg-white" style={{ width: `${Math.min((attemptHistory.length / (Math.max(attemptHistory.length, 1) * 3)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="px-6 mt-8 space-y-1">
            <button
              onClick={() => navigate('/profile')}
              className="cockpit-nav-item w-full flex items-center gap-3 px-2 py-2 text-xs text-left cursor-pointer rounded"
              style={{ color: '#888' }}
            >
              <User className="w-4 h-4" />
              <span className="font-mono uppercase tracking-wider">{user?.fullName}</span>
            </button>
            <button
              onClick={handleLogout}
              className="cockpit-nav-item w-full flex items-center gap-3 px-2 py-2 text-xs text-left cursor-pointer rounded"
              style={{ color: '#888' }}
            >
              <LogOut className="w-4 h-4" />
              <span className="font-mono uppercase tracking-wider">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative" style={{ background: '#050505' }}>
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          backgroundImage: `linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="p-8 max-w-6xl mx-auto relative z-10">
          {error && (
            <div className="mb-6 px-4 py-3 rounded border text-xs font-mono" style={{ background: '#1a0000', borderColor: '#ff3333', color: '#ff6666' }}>
              ERROR: {error}
            </div>
          )}

          {/* ── MY SKILLS TAB ── */}
          {tab === 'skills' && (
            <>
              <header className="mb-10 flex justify-between items-end pb-6" style={{ borderBottom: '1px solid #222' }}>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase text-white">Telemetry Overview</h1>
                  <p className="font-mono text-sm" style={{ color: '#888' }}>Real-time developer capability metrics.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono uppercase" style={{ color: '#666' }}>Last Sync</span>
                    <span className="font-mono text-xs flex items-center gap-1" style={{ color: '#39ff14' }}>
                      <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: '#39ff14' }} />
                      LIVE
                    </span>
                  </div>
                  {pendingInvites.length > 0 && (
                    <button
                      onClick={() => navigate(`/assessment/${pendingInvites[0].id}`)}
                      className="px-4 py-2 border font-mono text-xs uppercase tracking-widest rounded flex items-center gap-2 transition-colors cursor-pointer"
                      style={{
                        background: '#111',
                        borderColor: '#39ff14',
                        color: '#39ff14',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#39ff14'
                        ;(e.currentTarget as HTMLButtonElement).style.color = '#000'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#111'
                        ;(e.currentTarget as HTMLButtonElement).style.color = '#39ff14'
                      }}
                    >
                      <Zap className="w-3 h-3" /> Execute Scan
                    </button>
                  )}
                </div>
              </header>

              {skillLevels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#444' }}>
                    NO SKILL DATA FOUND
                  </div>
                  <div className="text-sm font-mono" style={{ color: '#666' }}>
                    Complete assessments to populate telemetry.
                  </div>
                </div>
              ) : (
                <>
                  {/* Gauges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {skillLevels.map((skill: any, i: number) => (
                      <Gauge key={skill.componentId} skill={skill} index={i} />
                    ))}
                  </div>

                  {/* Stat Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-lg overflow-hidden mb-8"
                    style={{ background: '#222', border: '1px solid #222' }}>
                    {[
                      { label: 'Active Nodes', value: String(skillLevels.length), Icon: Box },
                      { label: 'Mean Level', value: avgLevel, Icon: BarChart2 },
                      { label: 'Uptime (Days)', value: String(lastLevelUpDays), Icon: Clock },
                      { label: 'Subsystem', value: primaryProject, Icon: Cpu },
                    ].map(({ label, value, Icon }, i) => (
                      <div key={i} className="p-4 flex flex-col justify-center" style={{ background: '#111' }}>
                        <div className="flex items-center gap-2 mb-2" style={{ color: '#666' }}>
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
                        </div>
                        <div className="text-2xl font-mono text-white">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Subsystem Logs Table */}
                  <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #222', background: '#111' }}>
                    <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #222', background: '#0a0a0a' }}>
                      <h2 className="text-sm font-mono uppercase tracking-widest" style={{ color: '#888' }}>Subsystem Logs</h2>
                      <span className="text-[10px] font-mono" style={{ color: '#444' }}>SYS_LOG_001</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-mono uppercase tracking-widest" style={{ borderBottom: '1px solid #222', color: '#666', background: '#0a0a0a' }}>
                            <th className="px-6 py-3 font-normal">Component</th>
                            <th className="px-6 py-3 font-normal">Context Environment</th>
                            <th className="px-6 py-3 font-normal">Current Lv.</th>
                            <th className="px-6 py-3 font-normal">Last Calibration</th>
                            <th className="px-6 py-3 font-normal">Next Milestone</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {skillLevels.map((skill: any) => {
                            const Icon = getSkillIcon(skill.techStack || '')
                            return (
                              <tr key={skill.componentId} className="cockpit-table-row group cursor-pointer" style={{ borderBottom: '1px solid #222' }}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded flex items-center justify-center border transition-colors"
                                      style={{ background: '#1a1a1a', borderColor: '#333' }}>
                                      <Icon className="w-4 h-4 transition-colors" style={{ color: '#888' }} />
                                    </div>
                                    <span className="font-medium text-white">{skill.componentName}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs" style={{ color: '#888' }}>
                                  {skill.projectName} · {skill.techStack}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded font-mono text-xs border"
                                    style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14', borderColor: 'rgba(57,255,20,0.2)' }}>
                                    {skill.currentLevel ?? 0}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs" style={{ color: '#888' }}>
                                  {skill.lastLevelUpAt
                                    ? new Date(skill.lastLevelUpAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                    : '—'}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: '#222' }}>
                                      <div className="h-full bg-white" style={{ width: `${((skill.currentLevel ?? 0) % 1 || 0.25) * 100}%` }} />
                                    </div>
                                    <span className="text-[10px] font-mono" style={{ color: '#666' }}>
                                      L{(skill.currentLevel ?? 0) + 1} req
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── INVITES TAB ── */}
          {tab === 'invites' && (
            <>
              <header className="mb-8 pb-6" style={{ borderBottom: '1px solid #222' }}>
                <h1 className="text-3xl font-bold tracking-tight uppercase text-white mb-2">Pending Scans</h1>
                <p className="font-mono text-sm" style={{ color: '#888' }}>Queued assessment invitations.</p>
              </header>
              {pendingInvites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#444' }}>QUEUE EMPTY</div>
                  <div className="text-sm font-mono" style={{ color: '#666' }}>No pending assessment invites.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingInvites.map((invite: any) => (
                    <div key={invite.id} className="flex items-center justify-between p-6 rounded-xl border"
                      style={{ background: '#111', borderColor: '#222' }}>
                      <div>
                        <div className="font-medium text-white mb-1">{invite.componentName}</div>
                        <div className="text-xs font-mono" style={{ color: '#888' }}>
                          {invite.techStack} · Level {invite.level}
                        </div>
                        <div className="text-xs font-mono mt-1" style={{ color: '#666' }}>
                          INVITED: {new Date(invite.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/assessment/${invite.id}`)}
                        className="px-5 py-2.5 border font-mono text-xs uppercase tracking-widest rounded flex items-center gap-2 transition-colors cursor-pointer"
                        style={{ background: '#111', borderColor: '#39ff14', color: '#39ff14' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#39ff14'
                          ;(e.currentTarget as HTMLButtonElement).style.color = '#000'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#111'
                          ;(e.currentTarget as HTMLButtonElement).style.color = '#39ff14'
                        }}
                      >
                        <Zap className="w-3 h-3" /> Execute
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === 'history' && (
            <>
              <header className="mb-8 pb-6" style={{ borderBottom: '1px solid #222' }}>
                <h1 className="text-3xl font-bold tracking-tight uppercase text-white mb-2">Assessment Logs</h1>
                <p className="font-mono text-sm" style={{ color: '#888' }}>Historical scan records.</p>
              </header>
              {attemptHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#444' }}>NO RECORDS</div>
                  <div className="text-sm font-mono" style={{ color: '#666' }}>No past attempts found.</div>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #222', background: '#111' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-mono uppercase tracking-widest" style={{ borderBottom: '1px solid #222', color: '#666', background: '#0a0a0a' }}>
                          <th className="px-6 py-3 font-normal">Component</th>
                          <th className="px-6 py-3 font-normal">Level</th>
                          <th className="px-6 py-3 font-normal">Score</th>
                          <th className="px-6 py-3 font-normal">Status</th>
                          <th className="px-6 py-3 font-normal">Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {attemptHistory.map((attempt: any) => (
                          <tr key={attempt.id} className="cockpit-table-row" style={{ borderBottom: '1px solid #222' }}>
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{attempt.componentName}</div>
                              <div className="text-xs font-mono mt-0.5" style={{ color: '#666' }}>{attempt.techStack}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded font-mono text-xs border"
                                style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14', borderColor: 'rgba(57,255,20,0.2)' }}>
                                {attempt.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-white">
                              {attempt.score}/{attempt.totalQuestions}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border"
                                style={
                                  attempt.passed
                                    ? { background: 'rgba(57,255,20,0.1)', color: '#39ff14', borderColor: 'rgba(57,255,20,0.2)' }
                                    : attempt.status === 'PENDING_REVIEW'
                                    ? { background: 'rgba(255,200,0,0.1)', color: '#ffc800', borderColor: 'rgba(255,200,0,0.2)' }
                                    : { background: 'rgba(255,50,50,0.1)', color: '#ff5555', borderColor: 'rgba(255,50,50,0.2)' }
                                }>
                                {attempt.passed ? 'PASSED' : attempt.status === 'PENDING_REVIEW' ? 'REVIEW' : 'FAILED'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs" style={{ color: '#888' }}>
                              {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── TIMELINE TAB ── */}
          {tab === 'timeline' && (
            <>
              <header className="mb-8 pb-6" style={{ borderBottom: '1px solid #222' }}>
                <h1 className="text-3xl font-bold tracking-tight uppercase text-white mb-2">Skill Trajectory</h1>
                <p className="font-mono text-sm" style={{ color: '#888' }}>Chronological level-up events.</p>
              </header>
              {timeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#444' }}>NO EVENTS</div>
                  <div className="text-sm font-mono" style={{ color: '#666' }}>Pass assessments to log level-up events.</div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(57,255,20,0.2)' }} />
                  <div className="space-y-6">
                    {timeline.map((event: any, index: number) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-2.5 w-3 h-3 rounded-full border-2 border-black"
                          style={{ background: '#39ff14', boxShadow: '0 0 8px rgba(57,255,20,0.5)', top: '20px' }} />
                        <div className="p-5 rounded-xl border" style={{ background: '#111', borderColor: '#222' }}>
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                              <div className="font-medium text-white">{event.componentName}</div>
                              <div className="text-xs font-mono mt-0.5" style={{ color: '#666' }}>{event.techStack}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-mono font-semibold border"
                                style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14', borderColor: 'rgba(57,255,20,0.2)' }}>
                                LEVEL {event.levelReached}
                              </span>
                              <span className="text-sm font-mono" style={{ color: '#39ff14' }}>
                                {event.score}/{event.totalQuestions}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs font-mono mt-3" style={{ color: '#444' }}>
                            {event.date
                              ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                              : '—'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
