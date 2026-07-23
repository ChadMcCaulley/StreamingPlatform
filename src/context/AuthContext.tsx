import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthSession, Profile, UserAccount } from '../types'

const USERS_KEY = 'signal-users'
const SESSION_KEY = 'signal-session'
const LEGACY_USERS = 'streamflix-users'
const LEGACY_SESSION = 'streamflix-session'

const AVATAR_COLORS = ['#5b5bf0', '#0d9488', '#7c3aed', '#0891b2', '#ca8a04', '#db2777', '#4f46e5']

interface AuthContextValue {
  session: AuthSession | null
  user: UserAccount | null
  profile: Profile | null
  isAuthenticated: boolean
  hasProfile: boolean
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  register: (
    name: string,
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string }
  logout: () => void
  selectProfile: (profileId: string) => void
  clearProfile: () => void
  addProfile: (name: string, kids?: boolean) => { ok: true } | { ok: false; error: string }
  removeProfile: (profileId: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY) ?? localStorage.getItem(LEGACY_USERS)
    if (!raw) return seedDemoUser()
    const parsed = JSON.parse(raw) as UserAccount[]
    if (!Array.isArray(parsed) || !parsed.length) return seedDemoUser()
    // Ensure demo email alias exists for rebrand
    const withAlias = parsed.map((u) =>
      u.email === 'demo@streamflix.app' ? { ...u, email: 'demo@signal.app' } : u,
    )
    localStorage.setItem(USERS_KEY, JSON.stringify(withAlias))
    return withAlias
  } catch {
    return seedDemoUser()
  }
}

function seedDemoUser(): UserAccount[] {
  const demo: UserAccount = {
    id: 'user-demo',
    email: 'demo@signal.app',
    password: 'demo1234',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
    profiles: [
      { id: 'prof-1', name: 'Alex', avatarColor: '#5b5bf0' },
      { id: 'prof-2', name: 'Jordan', avatarColor: '#0d9488' },
      { id: 'prof-kids', name: 'Kids', avatarColor: '#ca8a04', kids: true },
    ],
  }
  localStorage.setItem(USERS_KEY, JSON.stringify([demo]))
  return [demo]
}

function writeUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? localStorage.getItem(LEGACY_SESSION)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (session.email === 'demo@streamflix.app') {
      session.email = 'demo@signal.app'
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  } catch {
    return null
  }
}

function writeSession(session: AuthSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>(() => readUsers())
  const [session, setSession] = useState<AuthSession | null>(() => readSession())

  const user = useMemo(
    () => (session ? users.find((u) => u.id === session.userId) ?? null : null),
    [session, users],
  )

  const profile = useMemo(() => {
    if (!user || !session?.profileId) return null
    return user.profiles.find((p) => p.id === session.profileId) ?? null
  }, [user, session])

  const persistSession = useCallback((next: AuthSession | null) => {
    setSession(next)
    writeSession(next)
  }, [])

  const updateUsers = useCallback((updater: (prev: UserAccount[]) => UserAccount[]) => {
    setUsers((prev) => {
      const next = updater(prev)
      writeUsers(next)
      return next
    })
  }, [])

  const login = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      const alias =
        normalized === 'demo@streamflix.app' ? 'demo@signal.app' : normalized
      const found = users.find((u) => u.email === alias || u.email === normalized)
      if (!found || found.password !== password) {
        return { ok: false as const, error: 'Invalid email or password' }
      }
      persistSession({
        userId: found.id,
        email: found.email,
        name: found.name,
        profileId: null,
      })
      return { ok: true as const }
    },
    [users, persistSession],
  )

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      if (!name.trim()) return { ok: false as const, error: 'Name is required' }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { ok: false as const, error: 'Enter a valid email' }
      }
      if (password.length < 6) {
        return { ok: false as const, error: 'Password must be at least 6 characters' }
      }
      if (users.some((u) => u.email === normalized)) {
        return { ok: false as const, error: 'An account with this email already exists' }
      }

      const account: UserAccount = {
        id: uid('user'),
        email: normalized,
        password,
        name: name.trim(),
        createdAt: new Date().toISOString(),
        profiles: [
          {
            id: uid('prof'),
            name: name.trim().split(/\s+/)[0] || 'Me',
            avatarColor: AVATAR_COLORS[0],
          },
        ],
      }

      updateUsers((prev) => [...prev, account])
      persistSession({
        userId: account.id,
        email: account.email,
        name: account.name,
        profileId: null,
      })
      return { ok: true as const }
    },
    [users, updateUsers, persistSession],
  )

  const logout = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const selectProfile = useCallback(
    (profileId: string) => {
      if (!session || !user) return
      if (!user.profiles.some((p) => p.id === profileId)) return
      persistSession({ ...session, profileId })
    },
    [session, user, persistSession],
  )

  const clearProfile = useCallback(() => {
    if (!session) return
    persistSession({ ...session, profileId: null })
  }, [session, persistSession])

  const addProfile = useCallback(
    (name: string, kids = false) => {
      if (!user || !session) return { ok: false as const, error: 'Not signed in' }
      const trimmed = name.trim()
      if (!trimmed) return { ok: false as const, error: 'Profile name is required' }
      if (user.profiles.length >= 5) {
        return { ok: false as const, error: 'Maximum of 5 profiles reached' }
      }
      if (user.profiles.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
        return { ok: false as const, error: 'A profile with that name already exists' }
      }

      const color = AVATAR_COLORS[user.profiles.length % AVATAR_COLORS.length]
      const nextProfile: Profile = {
        id: uid('prof'),
        name: trimmed,
        avatarColor: color,
        kids,
      }

      updateUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, profiles: [...u.profiles, nextProfile] } : u,
        ),
      )
      return { ok: true as const }
    },
    [user, session, updateUsers],
  )

  const removeProfile = useCallback(
    (profileId: string) => {
      if (!user) return
      if (user.profiles.length <= 1) return
      updateUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, profiles: u.profiles.filter((p) => p.id !== profileId) }
            : u,
        ),
      )
      if (session?.profileId === profileId) {
        persistSession({ ...session, profileId: null })
      }
    },
    [user, session, updateUsers, persistSession],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isAuthenticated: Boolean(session && user),
      hasProfile: Boolean(profile),
      login,
      register,
      logout,
      selectProfile,
      clearProfile,
      addProfile,
      removeProfile,
    }),
    [
      session,
      user,
      profile,
      login,
      register,
      logout,
      selectProfile,
      clearProfile,
      addProfile,
      removeProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
