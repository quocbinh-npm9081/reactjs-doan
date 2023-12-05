import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReauth from '@/store/customerFetchBaseQuery/baseQueryWithReauth'
import { RefreshTokenResponse } from '@/types/auth/auth'

import { LoginRequest } from '../../types/auth/login/loginRequest'
import { LoginResponse } from '../../types/auth/login/loginResponse'

export type RefreshTokenRequest = {
  refreshToken: string
}
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signin: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: 'auth/sign-in',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<undefined, { email: string }>({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<undefined, { password: string }>({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: 'auth/refresh-token',
        method: 'POST',
        body,
      }),
    }),
    isResendEmail: builder.mutation<undefined, { key: string }>({
      query: (body) => ({
        url: 'auth/forgot-password/resend',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useSigninMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useIsResendEmailMutation,
} = authApi
