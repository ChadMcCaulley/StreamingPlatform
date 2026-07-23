import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ThemeId } from '../types'

const STORAGE_KEY = 'signal-theme'
const LEGACY_KEY = 'streamflix-theme'

export const THEMES: { id: ThemeId; label: string; description: string }[] = [
  { id: 'dark', label: 'Dark', description: 'Low-light canvas for long sessions' },
  { id: 'light', label: 'Light', description: 'Bright daylight surfaces' },
]

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
  toggleTheme: () => void
  themes: typeof THEMES
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function normalizeTheme(value: string | null): ThemeId | null {
  if (value === 'light') return 'light'
  if (value === 'dark') return 'dark'
  // migrate multi-theme leftovers
  if (value === 'midnight' || value === 'crimson' || value === 'aurora') return 'dark'
  return null
}

function readTheme(): ThemeId {
  try {
    const stored = normalizeTheme(localStorage.getItem(STORAGE_KEY))
    if (stored) return stored
    const legacy = normalizeTheme(localStorage.getItem(LEGACY_KEY))
    if (legacy) return legacy
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => readTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, themes: THEMES }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
