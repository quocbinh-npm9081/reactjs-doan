import { createSlice } from '@reduxjs/toolkit'

import { UserState } from '@/types/user/userState'

import { userApi } from './userApi'

const initialState: UserState = {
  filter: {
    page: 0,
    size: 5,
    keyword: '',
    statuses: 'ALL',
    roles: 'ALL',
    sort: ['firstName,asc'],
  },
}
export const userSlice = createSlice({
  name: 'user',
  initialState: { ...initialState },
  reducers: {
    getUsers: (state, { payload }) => {
      const filter = payload.filter
      return {
        ...state,
        filter: { ...filter },
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getUser.matchFulfilled, (state, action) => {
      const { payload } = action

      return {
        ...state,
        currentUser: { ...payload },
      }
    })

    builder.addMatcher(userApi.endpoints.getUsers.matchFulfilled, (state, action) => {
      const filter = {
        ...action.payload.rg,
      }

      return {
        ...state,
        filter: filter,
        isLoading: action.payload,
      }
    })
  },
})

export const { getUsers } = userSlice.actions
