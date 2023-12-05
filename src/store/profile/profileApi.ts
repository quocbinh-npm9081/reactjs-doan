import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReauth from '@/store/customerFetchBaseQuery/baseQueryWithReauth'
import { UseUpdateUserProfile } from '@/types/profile/profileRequest'
import { UserProfile, UserProfileUpdate } from '@/types/profile/profileResponse'
import { Status } from '@/types/user/userEnum'
import { IUserChangePasswordRequest } from '@/types/user/userRequest'
import { UpdateStatusUserResponse } from '@/types/user/userResponse'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
    }),
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfileUpdate>>({
      query: (body: UseUpdateUserProfile) => ({
        url: 'profile',
        method: 'PUT',
        body,
      }),
    }),
    changePassword: builder.mutation<void, IUserChangePasswordRequest>({
      query: (body: IUserChangePasswordRequest) => ({
        url: 'profile/change-password',
        method: 'POST',
        body,
      }),
    }),
    requestChangeEmail: builder.mutation<void, void>({
      query: () => ({
        url: 'profile/request-change-email',
        method: 'POST',
      }),
    }),
    changeEmail: builder.mutation<void, { key: string; email: string }>({
      query: (body) => ({
        url: 'auth/change-email',
        method: 'POST',
        body: { key: body.key, username: body.email },
      }),
    }),
    finshChangeEmail: builder.mutation<void, { key: string }>({
      query: (body: { key: string }) => ({
        url: 'auth/finish-change-email',
        method: 'POST',
        body,
      }),
    }),
    updateStatusUserProfile: builder.mutation<
      UpdateStatusUserResponse,
      { userId: string; newStatus: Status }
    >({
      query: (body) => {
        return {
          url: `users/${body.userId}/status`,
          method: 'PUT',
          body: { status: body.newStatus },
        }
      },
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useChangePasswordMutation,
  useRequestChangeEmailMutation,
  useChangeEmailMutation,
  useFinshChangeEmailMutation,
  useUpdateUserProfileMutation,
  useUpdateStatusUserProfileMutation,
} = profileApi
