import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/store/auth/useAuth'
import { Privilege, Role } from '@/types/user/userEnum'

type ProtectOutletPrivilegesProps = {
  privileges: Privilege[]
  children: React.ReactElement
}

type ProtectOutletRoleProps = {
  roles: Role[]
  children: React.ReactElement
}

export function ProtectOutletPrivileges({ privileges, children }: ProtectOutletPrivilegesProps) {
  const auth = useAuth()
  const location = useLocation()

  if (privileges.some((ai) => auth?.authorities?.includes(ai))) {
    return children ? children : <Outlet />
  }

  return <Navigate replace to="/dashboard" state={{ from: location }} />
}

export function ProtectOutletRole({ roles, children }: ProtectOutletRoleProps) {
  const auth = useAuth()
  const location = useLocation()
  if (roles.some((ai) => auth?.role?.includes(ai))) {
    return children ? children : <Outlet />
  }

  return <Navigate replace to="/dashboard" state={{ from: location }} />
}
