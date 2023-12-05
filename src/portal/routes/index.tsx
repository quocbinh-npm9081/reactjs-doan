import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Privilege, Role } from '@/types/user/userEnum'

import { ProtectOutletPrivileges, ProtectOutletRole } from './ProtectOutlet/ProtectOutlet'

const PortalLayout = lazy(() => import('../layout/PortalLayout/PortalLayout'))
const DashboardPage = lazy(() => import('../dashboard/views/Dashboard'))
const UsersPage = lazy(() => import('../users/views/UsersPage/UsersPage'))
const CreateUser = lazy(() => import('../users/views/CreateUserPage/CreateUserPage'))
const UserProfilePage = lazy(() => import('../users/views/UserProfilePage/UserProfilePage'))
const ConfirmChangeEmail = lazy(() => import('../users/views/ChangeEmail/ConfirmChangeEmail'))
const ChangePasswordPage = lazy(() => import('../users/views/ChangePassword/ChangePasswordPage'))
const ProjectsPage = lazy(() => import('../projects/views/ProjectsPage/ProjectsPage'))
const UserDetailPage = lazy(() => import('../users/views/UserDetailPage/UserDetailPage'))
const ProjectPage = lazy(() => import('../projects/views/ProjectPage/ProjectPage'))

export const portalRoutes: Array<RouteObject> = [
  {
    path: '/',
    element: <PortalLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: (
          <ProtectOutletRole roles={[Role.ADMINISTRATOR]}>
            <UsersPage />
          </ProtectOutletRole>
        ),
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'projects/:id',
        element: (
          <ProtectOutletPrivileges privileges={[Privilege.VIEW_MY_PROJECT]}>
            <ProjectPage />
          </ProtectOutletPrivileges>
        ),
      },
      {
        path: 'users/create',
        element: (
          <ProtectOutletRole roles={[Role.ADMINISTRATOR]}>
            <CreateUser />
          </ProtectOutletRole>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectOutletPrivileges privileges={[Privilege.VIEW_PROFILE, Privilege.UPDATE_PROFILE]}>
            <UserProfilePage />
          </ProtectOutletPrivileges>
        ),
      },
      {
        path: '/change-email-confirm',
        element: <ConfirmChangeEmail />,
      },
      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: '/users/:id',
        element: (
          <ProtectOutletRole roles={[Role.ADMINISTRATOR]}>
            <UserDetailPage />
          </ProtectOutletRole>
        ),
      },
    ],
  },
]
