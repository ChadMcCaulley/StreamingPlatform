import { NavLink, useNavigate } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { useAuth } from '../context/AuthContext'
import './SideNav.css'

const LINKS = [
  { to: '/', label: 'Home', index: '01', end: true },
  { to: '/movies', label: 'Movies', index: '02' },
  { to: '/series', label: 'Series', index: '03' },
  { to: '/my-list', label: 'My List', index: '04' },
  { to: '/settings', label: 'Settings', index: '05' },
] as const

interface SideNavProps {
  mobileOpen?: boolean
  onNavigate?: () => void
}

export function SideNav({ mobileOpen = false, onNavigate }: SideNavProps) {
  const { profile, clearProfile } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className={`rail ${mobileOpen ? 'rail--open' : ''}`} aria-label="Primary">
      <div className="rail__top">
        <BrandLogo to="/" size="md" />
        <p className="rail__tag mono">Cinema, engineered.</p>
      </div>

      <nav className="rail__nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={'end' in link ? link.end : false}
            className={({ isActive }) => `rail__link ${isActive ? 'is-active' : ''}`}
            onClick={onNavigate}
          >
            <span className="rail__index mono">{link.index}</span>
            <span className="rail__label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="rail__bottom">
        {profile && (
          <button
            type="button"
            className="rail__profile"
            onClick={() => {
              clearProfile()
              onNavigate?.()
              navigate('/profiles')
            }}
            title="Switch profile"
          >
            <span className="rail__avatar" style={{ background: profile.avatarColor }}>
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <span className="rail__profile-meta">
              <span className="rail__profile-name">{profile.name}</span>
              <span className="rail__profile-hint mono">Switch profile</span>
            </span>
          </button>
        )}
        <p className="rail__build mono">Signal · demo build</p>
      </div>
    </aside>
  )
}
