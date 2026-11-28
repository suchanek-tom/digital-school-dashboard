import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type ProtectedRouteProps = {
  children?: ReactNode
}

/**
 * Nepřihlášeného uživatele přesměruje na /login a uloží původní adresu,
 * aby se po přihlášení mohl vrátit. Funguje jako layout route (<Outlet />)
 * i jako wrapper kolem children.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ?? <Outlet />
}
