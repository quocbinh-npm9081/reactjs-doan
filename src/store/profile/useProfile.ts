import { useSelector } from 'react-redux'

import { RootState } from '../store'

export const selectProfile = (state: RootState) => state.profileSlice

export const useProfile = () => {
  const profileState = useSelector(selectProfile)
  return {
    ...profileState.currentUser,
  }
}
