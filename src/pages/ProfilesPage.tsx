import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BrandLogo } from '../components/BrandLogo'
import './ProfilesPage.css'

export function ProfilesPage() {
  const { isAuthenticated, user, selectProfile, addProfile, removeProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [kids, setKids] = useState(false)
  const [error, setError] = useState('')
  const [manage, setManage] = useState(false)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const onSelect = (id: string) => {
    if (manage) return
    selectProfile(id)
    navigate('/', { replace: true })
  }

  const onAdd = (e: FormEvent) => {
    e.preventDefault()
    void addProfile(name, kids).then((result) => {
      if (!result.ok) {
        setError(result.error)
        return
      }
      setName('')
      setKids(false)
      setAdding(false)
      setError('')
    })
  }

  return (
    <div className="profiles">
      <header className="profiles__header">
        <BrandLogo to="/profiles" />
        <button type="button" className="profiles__logout mono" onClick={() => void logout()}>
          Sign out
        </button>
      </header>

      <div className="profiles__body">
        <p className="profiles__kicker mono">SELECT PROFILE</p>
        <h1>{manage ? 'Manage profiles' : "Who's watching?"}</h1>
        <p className="profiles__sub mono">{user.email}</p>

        <ul className="profiles__grid">
          {user.profiles.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className={`profiles__card ${manage ? 'profiles__card--manage' : ''}`}
                onClick={() => onSelect(p.id)}
              >
                <span className="profiles__index mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="profiles__avatar" style={{ background: p.avatarColor }}>
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <span className="profiles__name">{p.name}</span>
                {p.kids && <span className="profiles__kids mono">KIDS</span>}
              </button>
              {manage && user.profiles.length > 1 && (
                <button
                  type="button"
                  className="profiles__remove mono"
                  onClick={() => void removeProfile(p.id)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}

          {!manage && user.profiles.length < 5 && (
            <li>
              <button
                type="button"
                className="profiles__card profiles__card--add"
                onClick={() => setAdding(true)}
              >
                <span className="profiles__avatar profiles__avatar--add">+</span>
                <span className="profiles__name">Add</span>
              </button>
            </li>
          )}
        </ul>

        {adding && (
          <form className="profiles__form" onSubmit={onAdd}>
            {error && <p className="profiles__error">{error}</p>}
            <input
              type="text"
              placeholder="Profile name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <label className="profiles__check">
              <input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} />
              Kids profile
            </label>
            <div className="profiles__form-actions">
              <button type="submit" className="profiles__btn profiles__btn--primary">
                Save
              </button>
              <button
                type="button"
                className="profiles__btn"
                onClick={() => {
                  setAdding(false)
                  setError('')
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          className="profiles__manage mono"
          onClick={() => {
            setManage((v) => !v)
            setAdding(false)
          }}
        >
          {manage ? 'Done' : 'Manage profiles'}
        </button>
      </div>
    </div>
  )
}
