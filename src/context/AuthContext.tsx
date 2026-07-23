import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import { getStoredProfileId, getToken, setStoredProfileId, setToken } from '../api/client'
import type { AuthSession, Profile, UserAccount } from '../types'

interface AuthContextValue {
  session: AuthSession | null
  user: UserAccount | null
  profile: Profile | null
  isAuthenticated: boolean
  hasProfile: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => Promise<void>
  selectProfile: (profileId: string) => void
  clearProfile: () => void
  addProfile: (
    name: string,
    kids?: boolean,
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  removeProfile: (profileId: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function buildSession(user: UserAccount, profileId: string | null): AuthSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    profileId,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null)
  const [profileId, setProfileId] = useState<string | null>(() => getStoredProfileId())
  const [loading, setLoading] = useState(true)

  const profile = useMemo(() => {
    if (!user || !profileId) return null
    return user.profiles.find((p) => String(p.id) === String(profileId)) ?? null
  }, [user, profileId])

  const session = useMemo(
    () => (user ? buildSession(user, profileId) : null),
    [user, profileId],
  )

  const refreshUser = useCallback(async () => {
    const me = await authApi.fetchMe()
    setUser(me)
    // drop invalid profile id
    if (profileId && !me.profiles.some((p) => String(p.id) === String(profileId))) {
      setProfileId(null)
      setStoredProfileId(null)
    }
  }, [profileId])

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const me = await authApi.fetchMe()
        if (!cancelled) setUser(me)
      } catch {
        if (!cancelled) {
          setToken(null)
          setUser(null)
          setProfileId(null)
          setStoredProfileId(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password)
      const mapped = authApi.mapUser(data.user)
      setUser(mapped)
      setProfileId(null)
      setStoredProfileId(null)
      return { ok: true as const }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed'
      return { ok: false as const, error: msg }
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const data = await authApi.register(name, email, password)
      const mapped = authApi.mapUser(data.user)
      setUser(mapped)
      setProfileId(null)
      setStoredProfileId(null)
      return { ok: true as const }
    } catch (e) {
      let msg = e instanceof Error ? e.message : 'Registration failed'
      // surface field errors from DRF
      if (e && typeof e === 'object' && 'body' in e) {
        const body = (e as { body: Record<string, string[] | string> }).body
        if (body && typeof body === 'object') {
          const first = Object.values(body).flat()[0]
          if (first) msg = String(first)
        }
      }
      return { ok: false as const, error: msg }
    }
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setProfileId(null)
    setStoredProfileId(null)
  }, [])

  const selectProfile = useCallback(
    (id: string) => {
      if (!user?.profiles.some((p) => String(p.id) === String(id))) return
      setProfileId(String(id))
      setStoredProfileId(String(id))
    },
    [user],
  )

  const clearProfile = useCallback(() => {
    setProfileId(null)
    setStoredProfileId(null)
  }, [])

  const addProfile = useCallback(async (name: string, kids = false) => {
    try {
      await authApi.createProfile(name, kids)
      const me = await authApi.fetchMe()
      setUser(me)
      return { ok: true as const }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not create profile'
      return { ok: false as const, error: msg }
    }
  }, [])

  const removeProfile = useCallback(
    async (id: string) => {
      await authApi.deleteProfile(id)
      if (String(profileId) === String(id)) {
        setProfileId(null)
        setStoredProfileId(null)
      }
      const me = await authApi.fetchMe()
      setUser(me)
    },
    [profileId],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isAuthenticated: Boolean(user && getToken()),
      hasProfile: Boolean(profile),
      loading,
      login,
      register,
      logout,
      selectProfile,
      clearProfile,
      addProfile,
      removeProfile,
      refreshUser,
    }),
    [
      session,
      user,
      profile,
      loading,
      login,
      register,
      logout,
      selectProfile,
      clearProfile,
      addProfile,
      removeProfile,
      refreshUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
