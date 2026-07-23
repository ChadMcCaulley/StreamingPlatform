import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, clearProfile, logout } = useAuth()
  const { theme, setTheme, themes } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setQuery('')
      setSearchOpen(false)
    }
  }, [location.pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
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

  const cycleTheme = () => {
    const idx = themes.findIndex((t) => t.id === theme)
    const next = themes[(idx + 1) % themes.length]
    setTheme(next.id)
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="StreamFlix home">
          <span className="navbar__logo-mark">S</span>
          <span className="navbar__logo-text">StreamFlix</span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => (isActive ? 'active' : '')}>
            Movies
          </NavLink>
          <NavLink to="/series" className={({ isActive }) => (isActive ? 'active' : '')}>
            Series
          </NavLink>
          <NavLink to="/my-list" className={({ isActive }) => (isActive ? 'active' : '')}>
            My List
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <form
            className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`}
            onSubmit={onSubmit}
            role="search"
          >
            <button
              type="button"
              className="navbar__icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
            <input
              type="search"
              placeholder="Titles, genres, people"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search catalog"
            />
          </form>

          <button
            type="button"
            className="navbar__icon-btn"
            onClick={cycleTheme}
            aria-label={`Theme: ${theme}. Click to change.`}
            title={`Theme: ${themes.find((t) => t.id === theme)?.label}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          </button>

          <div className="navbar__profile" ref={menuRef}>
            <button
              type="button"
              className="navbar__avatar"
              style={{ background: profile?.avatarColor ?? 'var(--accent)' }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
            >
              <span>{profile?.name?.charAt(0).toUpperCase() ?? '?'}</span>
            </button>
            {menuOpen && (
              <div className="navbar__menu" role="menu">
                <div className="navbar__menu-head">
                  <span
                    className="navbar__menu-dot"
                    style={{ background: profile?.avatarColor }}
                  />
                  <div>
                    <strong>{profile?.name}</strong>
                    <p>Profile</p>
                  </div>
                </div>
                <button type="button" role="menuitem" onClick={() => { clearProfile(); navigate('/profiles') }}>
                  Switch profile
                </button>
                <Link to="/settings" role="menuitem" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <button type="button" role="menuitem" className="navbar__menu-danger" onClick={logout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
