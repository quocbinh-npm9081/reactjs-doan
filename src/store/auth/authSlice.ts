import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AuthState } from '../../types/auth/auth'
import { authApi } from './authApi'

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: undefined,
  refreshToken: undefined,
  firstName: undefined,
  lastName: undefined,
  username: undefined,
  authorities: undefined,
  redirect: undefined,
  role: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    signOut: (
      state,
      action: PayloadAction<{ payload: string | undefined; type: string | undefined } | undefined>,
    ) => {
      state.redirect =
        action && typeof action.payload?.payload === 'string' ? action.payload.payload : undefined
      state.accessToken = undefined
      state.isAuthenticated = false
      state.refreshToken = undefined
      state.firstName = undefined
      state.lastName = undefined
      state.username = undefined
      state.authorities = undefined
      state.role = undefined
    },

    refreshTokenSuccess: (state, action) => {
      const { payload } = action
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
      state.isAuthenticated = true
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.username = payload.username
      state.authorities = payload.authorities
      state.redirect = undefined
      state.role = payload.role
    },
    updateAuthInfo: (state, action) => {
      const { payload } = action
      state.firstName = payload.firstName
      state.lastName = payload.lastName
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signin.matchFulfilled, (state, action) => {
        const { payload } = action
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        state.isAuthenticated = true
        state.firstName = payload.firstName
        state.lastName = payload.lastName
        state.username = payload.username
        state.authorities = payload.authorities
        state.redirect = undefined
        state.role = payload.role
      })
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
        const { payload } = action
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        state.isAuthenticated = true
        state.firstName = payload.firstName
        state.lastName = payload.lastName
        state.username = payload.username
        state.authorities = payload.authorities
        state.redirect = undefined
        state.role = payload.role
      })
  },
})

export const { signOut, refreshTokenSuccess, updateAuthInfo } = authSlice.actions
