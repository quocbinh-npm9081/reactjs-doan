import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
const ActiveNewUserEmail = lazy(
  () => import('../../users/components/CreateUserForm/ActiveNewUserEmail'),
)

export const confirmRoutes: Array<RouteObject> = [
  {
    path: '/',
    children: [
      {
        path: '/auth/sign-up/finish/:id',
        element: <ActiveNewUserEmail/>,
      },
    ],
  },
]
