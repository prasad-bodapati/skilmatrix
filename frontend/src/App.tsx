import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { clearToken } from './api'
import Login from './components/Login'
import Register from './components/Register'
import VerifyEmail from './components/VerifyEmail'
import SetPassword from './components/SetPassword'
import ResetPassword from './components/ResetPassword'
import AdminDashboard from './components/AdminDashboard'
import DeveloperDashboard from './components/DeveloperDashboard'
import TakeAssessment from './components/TakeAssessment'

interface User {
  userId: number
  email: string
  fullName: string
  role: string
  token: string
}

interface AuthContextType {
  user: User | null
  loginUser: (data: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginUser: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        setToken(parsed.token)
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const loginUser = (data: User) => {
    setUser(data)
    setToken(data.token)
    localStorage.setItem('user', JSON.stringify(data))
  }

  const logout = () => {
    setUser(null)
    clearToken()
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['ROOT', 'TEAM_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developer"
          element={
            <ProtectedRoute roles={['DEVELOPER']}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:inviteId"
          element={
            <ProtectedRoute>
              <TakeAssessment />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
