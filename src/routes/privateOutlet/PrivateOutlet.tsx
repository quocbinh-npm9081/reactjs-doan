import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/store/auth/useAuth'

export function PrivateOutlet() {
  const { isAuthenticated, redirect } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    if (typeof redirect === 'string' && redirect !== '') {
      return <Navigate replace to={redirect} state={{ from: location }} />
    }

    return <Navigate replace to="/sign-in" state={{ from: location }} />
  }

  return <Outlet />
}
