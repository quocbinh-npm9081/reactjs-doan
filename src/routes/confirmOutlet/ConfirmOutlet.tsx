import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { signOut } from '@/store/auth/authSlice'
import { useAuth } from '@/store/auth/useAuth'

export function ConfirmOutlet() {
  const { redirect, isAuthenticated } = useAuth()
  const location = useLocation()
  const dispatch = useDispatch()
  if (isAuthenticated) {
    dispatch(signOut())
  }
  if (typeof redirect === 'string' && redirect !== '') {
    return <Navigate replace to={redirect} state={{ from: location }} />
  }

  return <Outlet />
}
