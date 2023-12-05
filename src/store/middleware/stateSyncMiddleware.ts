import { Dispatch, Middleware, MiddlewareAPI } from 'redux'

import { localToken } from '../../constant/constant'
import { signOut } from '../auth/authSlice'

export const stateSyncMiddleware: Middleware<Dispatch> = ({
  getState,
  dispatch,
}: MiddlewareAPI) => {
  return (next) => {
    return (action) => {
      const result = next(action)
      const state = getState()

      if (action?.payload?.status === 401) {
        dispatch(signOut())
      }
      switch (action.type) {
        case 'authApi/executeMutation/fulfilled':
        case 'userApi/executeMutation/fulfilled':
        case 'projectApi/executeQuery/fulfilled':
        case 'projectApi/executeMutation/fulfilled':
        case 'auth/signOut':
          localStorage.setItem(localToken, JSON.stringify(state.auth))

          break
      }
      return result
    }
  }
}
