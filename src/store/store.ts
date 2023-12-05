import { configureStore } from '@reduxjs/toolkit'

import { localToken } from '@/constant/constant'

import { authApi } from './auth/authApi'
import { authSlice } from './auth/authSlice'
import { invitationApi } from './invitation/invitationApi'
import { stateSyncMiddleware } from './middleware'
import { profileApi } from './profile/profileApi'
import { profileSlice } from './profile/profileSlice'
import { projectApi } from './project/projectApi'
import { projectSlice } from './project/projectSlice'
import { taskApi } from './task/taskApi'
import { userApi } from './user/userApi'
import { userSlice } from './user/userSlice'

const getAuthState = () => {
  const rawData = localStorage.getItem(localToken)
  if (rawData) {
    return JSON.parse(rawData)
  }
  return undefined
}

const reducer = {
  [userSlice.name]: userSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
  [projectSlice.name]: projectSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [invitationApi.reducerPath]: invitationApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
}

const preloadedState = {
  [authSlice.name]: getAuthState(),
}

const store = configureStore({
  reducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      stateSyncMiddleware,
      userApi.middleware,
      authApi.middleware,
      profileApi.middleware,
      projectApi.middleware,
      invitationApi.middleware,
      taskApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
