import { RouteObject } from 'react-router-dom'

import { authRoutes } from '@/auth/routes'
import { portalRoutes } from '@/portal/routes'
import ActiveNewUserEmail from '@/portal/users/components/CreateUserForm/ActiveNewUserEmail'

import { ConfirmOutlet } from './confirmOutlet/ConfirmOutlet'
import { PrivateOutlet } from './privateOutlet/PrivateOutlet'
import { PublicOutlet } from './publicOutlet/PublicOutlet'

export const appRoutes: Array<RouteObject> = [
  {
    element: <ConfirmOutlet />,
    children: [
      {
        path: '/',
        children: [
          {
            path: '/auth/sign-up/finish/:id',
            element: <ActiveNewUserEmail />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateOutlet />,
    children: [...portalRoutes],
  },
  {
    element: <PublicOutlet />,
    children: [...authRoutes],
  },
]
