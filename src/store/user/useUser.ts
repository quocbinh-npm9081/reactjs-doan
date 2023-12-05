import { useSelector } from 'react-redux'

import { RootState } from '../store'

const selectUserState = (state: RootState) => {
  return state.user
}

export const useGetUsersFilter = () => {
  const userState = useSelector(selectUserState)
  return {
    ...userState.filter,
  }
}
