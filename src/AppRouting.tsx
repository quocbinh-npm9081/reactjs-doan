import { Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import { appRoutes } from './routes'
import { PageLoader } from './routes/PageLoader/PageLoader'

export default function AppRouting() {
  const routes = useRoutes([
    {
      path: '',
      element: <Navigate replace to="/sign-in" />,
    },
    ...appRoutes,
  ])

  return <Suspense fallback={<PageLoader />}>{routes}</Suspense>
}
