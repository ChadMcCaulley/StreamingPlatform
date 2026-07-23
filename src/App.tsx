import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { MyListProvider } from './context/MyListContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { MoviesPage } from './pages/MoviesPage'
import { SeriesPage } from './pages/SeriesPage'
import { MyListPage } from './pages/MyListPage'
import { SearchPage } from './pages/SearchPage'
import { WatchPage } from './pages/WatchPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilesPage } from './pages/ProfilesPage'
import { SettingsPage } from './pages/SettingsPage'
import './App.css'

function AppRoutes() {
  const location = useLocation()
  const { isAuthenticated, hasProfile } = useAuth()
  const isWatch = location.pathname.startsWith('/watch')
  const isAuthScreen = ['/login', '/register', '/profiles'].includes(location.pathname)
  const useShell = isAuthenticated && hasProfile && !isWatch && !isAuthScreen

  const routes = (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute requireProfile={false}>
            <ProfilesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <MoviesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/series"
        element={
          <ProtectedRoute>
            <SeriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-list"
        element={
          <ProtectedRoute>
            <MyListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/watch/:id"
        element={
          <ProtectedRoute>
            <WatchPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  if (useShell) {
    return <AppShell>{routes}</AppShell>
  }

  return routes
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MyListProvider>
            <div className="app">
              <AppRoutes />
            </div>
          </MyListProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
