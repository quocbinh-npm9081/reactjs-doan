import { useSelector } from 'react-redux'

import { RootState } from '../store'

export const selectAuth = (state: RootState) => state.auth

export const useAuth = () => {
  const auth = useSelector(selectAuth)
  return {
    ...auth,
  }
}
