import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './SettingsPage.css'

export function SettingsPage() {
  const { user, profile, logout, clearProfile } = useAuth()
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="page settings">
      <header className="page__header">
        <p className="page__kicker mono">05 · SETTINGS</p>
        <h1>Settings</h1>
        <p>Appearance and account — kept simple on purpose.</p>
      </header>

      <div className="settings__sections">
        <section className="settings__card">
          <h2>Appearance</h2>
          <p className="settings__lead mono">THEME · DARK | LIGHT</p>
          <div className="settings__themes" role="listbox" aria-label="Theme">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={theme === t.id}
                className={`settings__theme ${theme === t.id ? 'is-active' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <span className={`settings__theme-preview settings__theme-preview--${t.id}`} />
                <span className="settings__theme-label">{t.label}</span>
                <span className="settings__theme-desc">{t.description}</span>
              </button>
            ))}
          </div>
          <p className="settings__note mono">
            Brand mark stays #C8F542 in both themes — identity does not follow mode.
          </p>
        </section>

        <section className="settings__card">
          <h2>Account</h2>
          <dl className="settings__dl">
            <div>
              <dt className="mono">NAME</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt className="mono">EMAIL</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt className="mono">PROFILE</dt>
              <dd>
                {profile ? (
                  <span className="settings__profile-pill">
                    <span style={{ background: profile.avatarColor }} />
                    {profile.name}
                  </span>
                ) : (
                  'None'
                )}
              </dd>
            </div>
          </dl>
          <div className="settings__actions">
            <button type="button" className="settings__btn" onClick={clearProfile}>
              Switch profile
            </button>
            <button
              type="button"
              className="settings__btn settings__btn--danger"
              onClick={() => void logout()}
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="settings__card settings__card--muted">
          <h2>About this build</h2>
          <p>
            Signal is a portfolio streaming app. The React UI talks to a Django REST API for auth,
            profiles, catalog, My List, and continue watching. Demo login: demo@signal.app /
            demo1234.
          </p>
        </section>
      </div>
    </div>
  )
}
