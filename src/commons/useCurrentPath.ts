import { matchRoutes, useLocation } from 'react-router-dom'

export const useCurrentPath = ({ path }: { path: string }) => {
  const location = useLocation()
  const routes = [{ path: path }]
  const match = matchRoutes(routes, location)
  if (match != null && match[0].route?.path === path) return true
  return false
}
