import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireProfile?: boolean
}

export function ProtectedRoute({ children, requireProfile = true }: ProtectedRouteProps) {
  const { isAuthenticated, hasProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="home home--status" style={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
        <p className="mono">Loading session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireProfile && !hasProfile) {
    return <Navigate to="/profiles" replace />
  }

  return children
}
