import { createSlice } from '@reduxjs/toolkit'

import { TProfileState } from '@/types/project/projectState'

const initialState: TProfileState = {
  filter: {
    page: 0,
    size: 5,
    keyword: '',
    statuses: 'ALL',
    sort: ['name,asc'],
  },
}

export const projectSlice = createSlice({
  name: 'projectSlice',
  initialState: { ...initialState },
  reducers: {
    getProjects: (state, { payload }) => {
      const filter = payload.filter
      return {
        ...state,
        filter: { ...filter },
      }
    },
  },
})
export const { getProjects } = projectSlice.actions
