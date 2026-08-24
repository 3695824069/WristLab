import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: number
  phone: string
  nickname: string
  avatar: string
  email?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'fithub_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { token: t, user: u } = JSON.parse(stored)
        if (t && u) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setToken(t)
          setUser(u)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (t: string, u: User) => {
    setToken(t)
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateUser = (updated: User) => {
    setUser(updated)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      data.user = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
