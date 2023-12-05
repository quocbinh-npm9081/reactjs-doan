import { createApi } from '@reduxjs/toolkit/query/react'

import { UpdateUserProfileRequest } from '@/types/invitation/invitationRequest'
import { getInvitationsResponse } from '@/types/invitation/invitationResponse'

import baseQueryWithReauth from '../customerFetchBaseQuery/baseQueryWithReauth'

export const invitationApi = createApi({
  reducerPath: 'invitationApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    checkUserMatched: builder.mutation<{ isMatch: boolean }, { key: string }>({
      query: (body: { key: string }) => ({
        url: 'invitations/check-user',
        method: 'POST',
        body,
      }),
    }),
    checkRegisteringUser: builder.mutation<{ isRegisteringUser: boolean }, { key: string }>({
      query: (body: { key: string }) => ({
        url: 'auth/check-registering-user',
        method: 'POST',
        body,
      }),
    }),
    updateProfile: builder.mutation<void, UpdateUserProfileRequest>({
      query: (body) => ({
        url: 'public-access/invitation-move-on',
        method: 'POST',
        body,
      }),
    }),
    getMyInvitations: builder.query<getInvitationsResponse[], void>({
      query: () => ({
        url: 'invitations/my',
        method: 'GET',
      }),
    }),
    responseInvitations: builder.mutation<void, { id: string; accept: boolean }>({
      query: (body: { id: string; accept: boolean }) => ({
        url: `invitations/${body.id}/response`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useCheckUserMatchedMutation,
  useCheckRegisteringUserMutation,
  useUpdateProfileMutation,
  useGetMyInvitationsQuery,
  useResponseInvitationsMutation,
} = invitationApi
