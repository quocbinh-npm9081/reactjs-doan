import { createApi, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react'

import { UserProfile } from '@/types/profile/profileResponse'
import { Role, Status } from '@/types/user/userEnum'
import {
  CreateUser,
  GetUsersAutocompleteRequest,
  GetUsersRequest,
  UpdateUserRequest,
} from '@/types/user/userRequest'

import {
  UpdateStatusUserResponse,
  UserListResponse,
  UsersAutocompleteResponse,
} from '../../types/user/userResponse'
import baseQueryWithReauth from '../customerFetchBaseQuery/baseQueryWithReauth'

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Users'],
  keepUnusedDataFor: 0,
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.query<UserProfile, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation<UserProfile, { id: string; user: Partial<UpdateUserRequest> }>({
      query: (body) => ({
        url: `users/${body.id}`,
        method: 'PUT',
        body: body.user,
      }),
    }),
    addUser: builder.mutation<CreateUser, Partial<CreateUser>>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
    }),
    getUsers: builder.query<UserListResponse, GetUsersRequest>({
      query: (params: GetUsersRequest) => {
        return {
          url: 'users?',
          method: 'GET',
          params: {
            ...params,
            statuses: params?.statuses === 'ALL' ? undefined : (params?.statuses as Status),
            roles: params?.roles === 'ALL' ? undefined : (params?.roles as Role),
          },
        }
      },
      keepUnusedDataFor: 0,

      transformResponse: (
        response: UserListResponse,
        meta: FetchBaseQueryMeta,
        rg: GetUsersRequest,
      ) => {
        return {
          ...response,
          rg: rg,
        }
      },
      providesTags: (result) => {
        if (result && result.content) {
          const final = [
            ...result.content.map(({ id }) => ({ type: 'Users' as const, id })),
            {
              type: 'Users' as const,
              id: 'LIST',
            },
          ]
          return final
        }
        return [{ type: 'Users' as const, id: 'LIST' }]
      },
    }),
    updateStatusUser: builder.mutation<
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
      invalidatesTags: (result, error, data) => {
        return error ? [] : [{ type: 'Users', id: data.userId }]
      },
    }),
    confirmRegister: builder.mutation<void, { key: string }>({
      query: (body: { key: string }) => ({
        url: 'auth/confirm-register',
        method: 'POST',
        body,
      }),
    }),
    getAutocompleteUsers: builder.query<UsersAutocompleteResponse[], GetUsersAutocompleteRequest>({
      query: (params: GetUsersAutocompleteRequest) => ({
        url: 'users/autocomplete',
        method: 'GET',
        params: { ...params },
      }),
    }),
  }),
})

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateStatusUserMutation,
  useUpdateUserMutation,
  useConfirmRegisterMutation,
  useGetAutocompleteUsersQuery,
} = userApi
