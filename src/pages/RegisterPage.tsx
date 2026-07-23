import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BrandLogo } from '../components/BrandLogo'
import './AuthPages.css'

export function RegisterPage() {
  const { register, isAuthenticated, hasProfile } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={hasProfile ? '/' : '/profiles'} replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      const result = register(name, email, password)
      setLoading(false)
      if (!result.ok) {
        setError(result.error)
        return
      }
      navigate('/profiles', { replace: true })
    }, 300)
  }

  return (
    <div className="auth">
      <aside className="auth__panel">
        <div className="auth__panel-top">
          <BrandLogo to="/login" size="lg" />
          <div className="auth__panel-copy">
            <h1>Join Signal.</h1>
            <p>
              Free local demo — accounts live in your browser until we wire a real API.
            </p>
          </div>
        </div>
        <p className="auth__panel-foot">Signal · portfolio demo · React + TypeScript</p>
      </aside>

      <div className="auth__main">
        <div className="auth__card">
          <p className="page__kicker mono">AUTH · REGISTER</p>
          <h1>Create account</h1>
          <p className="auth__subtitle">No credit card. Just a name and email.</p>

          <form className="auth__form" onSubmit={onSubmit}>
            {error && <div className="auth__error" role="alert">{error}</div>}
            <label className="auth__field">
              <span>Name</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="auth__submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <p className="auth__switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
