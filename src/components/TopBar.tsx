import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { BrandLogo } from './BrandLogo'
import './TopBar.css'

interface TopBarProps {
  onMenuToggle: () => void
  menuOpen?: boolean
}

export function TopBar({ onMenuToggle, menuOpen = false }: TopBarProps) {
  const [query, setQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, clearProfile, logout, session } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      const q = new URLSearchParams(location.search).get('q') ?? ''
      setQuery(q)
    } else {
      setQuery('')
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    setAccountOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="topbar">
      <div className="topbar__brand-mobile">
        <BrandLogo to="/" size="sm" showWordmark={false} />
      </div>

      <button
        type="button"
        className="topbar__menu-btn"
        onClick={onMenuToggle}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      <form className="topbar__search" onSubmit={onSubmit} role="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search…"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search catalog"
        />
        <kbd className="topbar__kbd mono">/</kbd>
      </form>

      <div className="topbar__actions">
        <span className="topbar__session" title={session?.email}>
          {profile?.name ?? ''}
        </span>

        <button
          type="button"
          className="topbar__icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 14.5A8.5 8.5 0 1111.5 3a7 7 0 009.5 11.5z" />
            </svg>
          )}
        </button>

        <div className="topbar__profile" ref={menuRef}>
          <button
            type="button"
            className="topbar__avatar"
            style={{ background: profile?.avatarColor ?? 'var(--brand-ink)' }}
            onClick={() => setAccountOpen((v) => !v)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            {profile?.name?.charAt(0).toUpperCase() ?? '?'}
          </button>
          {accountOpen && (
            <div className="topbar__dropdown" role="menu">
              <div className="topbar__dropdown-head mono">ACCOUNT</div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  clearProfile()
                  navigate('/profiles')
                }}
              >
                Switch profile
              </button>
              <Link to="/settings" role="menuitem" onClick={() => setAccountOpen(false)}>
                Settings
              </Link>
              <button type="button" role="menuitem" className="is-danger" onClick={logout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
