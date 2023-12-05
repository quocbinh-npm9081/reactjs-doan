import { useSelector } from 'react-redux'

import { RootState } from '../store'

const selectProjectState = (state: RootState) => {
  return state.projectSlice
}

export const useGetProfilesFilter = () => {
  const project = useSelector(selectProjectState)
  return {
    ...project.filter,
  }
}
