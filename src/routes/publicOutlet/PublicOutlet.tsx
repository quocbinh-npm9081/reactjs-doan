import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/store/auth/useAuth'

export function PublicOutlet() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated && !window.location.href.includes('invitation')) {
    return <Navigate to={`/dashboard`} />
  }

  return <Outlet />
}
