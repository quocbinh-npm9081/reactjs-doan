import { createSlice } from '@reduxjs/toolkit'

import { ProfileState } from '@/types/profile/profileState'

import { profileApi } from './profileApi'

const initialState: ProfileState = {
  currentUser: undefined,
}

export const profileSlice = createSlice({
  name: 'profileSlice',
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(profileApi.endpoints.getUserProfile.matchFulfilled, (state, action) => {
      const { payload } = action

      return {
        ...state,
        currentUser: { ...payload },
      }
    })
    builder.addMatcher(profileApi.endpoints.updateUserProfile.matchFulfilled, (state, action) => {
      const { payload } = action
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...payload,
        },
      }
    })
  },
})
