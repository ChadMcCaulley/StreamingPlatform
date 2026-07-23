import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BrandLogo } from '../components/BrandLogo'
import './AuthPages.css'

export function LoginPage() {
  const { login, isAuthenticated, hasProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('demo@signal.app')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={hasProfile ? from || '/' : '/profiles'} replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    void login(email, password).then((result) => {
      setLoading(false)
      if (!result.ok) {
        setError(result.error)
        return
      }
      navigate('/profiles', { replace: true })
    })
  }

  return (
    <div className="auth">
      <aside className="auth__panel">
        <div className="auth__panel-top">
          <BrandLogo to="/login" size="lg" />
          <div className="auth__panel-copy">
            <h1>Cinema, engineered.</h1>
            <p>
              A streaming UI built to show craft — layout systems, type hierarchy, and
              thoughtful interaction — not another red-and-black clone.
            </p>
          </div>
        </div>
        <p className="auth__panel-foot">Signal · portfolio demo · React + TypeScript</p>
      </aside>

      <div className="auth__main">
        <div className="auth__card">
          <p className="page__kicker mono">AUTH · SIGN IN</p>
          <h1>Welcome back</h1>
          <p className="auth__subtitle">Sign in to pick a profile and start watching.</p>

          <form className="auth__form" onSubmit={onSubmit}>
            {error && <div className="auth__error" role="alert">{error}</div>}
            <label className="auth__field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="auth__field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="auth__submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth__hint">
            demo · <code>demo@signal.app</code> / <code>demo1234</code>
            <br />
            (also accepts legacy <code>demo@streamflix.app</code>)
          </p>
          <p className="auth__switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
