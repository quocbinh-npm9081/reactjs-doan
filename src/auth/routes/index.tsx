import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import MinimalLayout from '@/layout/MinimalLayout/MinimalLayout'
import CheckInvitationEmail from '@/portal/invitations/views/CheckInvitationEmail/CheckInvitationEmail'
import UpdateProfileUserPage from '@/portal/invitations/views/UpdateProfileUserPage/UpdateProfileUserPage'
import ActiveNewUserEmail from '@/portal/users/components/CreateUserForm/ActiveNewUserEmail'
import ActiveNewEmail from '@/portal/users/views/ChangeEmail/ActiveNewEmail'
import ChangeEmailPage from '@/portal/users/views/ChangeEmail/ChangeEmailPage'
import EmailConfirmationPage from '@/portal/users/views/ChangeEmail/EmailConfirmationPage'
import EmailConfirmationPageActive from '@/portal/users/views/ChangeEmail/EmailConfirmationPageActive'

import ForgotPasswordPage from '../views/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from '../views/ResetPasswordPage/ResetPasswordPage'

const SignInPage = lazy(() => import('../views/SignInPage/SignInPage'))

export const authRoutes: Array<RouteObject> = [
  {
    path: '/',
    element: <MinimalLayout />,
    children: [
      {
        path: 'sign-in',
        element: <SignInPage />,
      },
      {
        path: 'auth/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'auth/reset-password/:id',
        element: <ResetPasswordPage />,
      },
      {
        path: '/email-confirmation',
        element: <EmailConfirmationPage />,
      },
      {
        path: 'auth/change-email/:id',
        element: <ChangeEmailPage />,
      },
      {
        path: 'auth/email-confirmation/active',
        element: <EmailConfirmationPageActive />,
      },
      {
        path: 'auth/change-email/confirm/:id',
        element: <ActiveNewEmail />,
      },
      {
        path: 'auth/sign-up/finish/:id',
        element: <ActiveNewUserEmail />,
      },
      {
        path: 'invitation/:id',
        element: <CheckInvitationEmail />,
      },
      {
        path: 'public-access/invitation-move-on/:id',
        element: <UpdateProfileUserPage />,
      },
    ],
  },
]
