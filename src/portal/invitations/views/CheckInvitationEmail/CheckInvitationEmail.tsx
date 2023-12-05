import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PageLoader } from '@/routes/PageLoader/PageLoader'
import { signOut } from '@/store/auth/authSlice'
import { useAuth } from '@/store/auth/useAuth'
import {
  useCheckRegisteringUserMutation,
  useCheckUserMatchedMutation,
} from '@/store/invitation/invitationApi'
import { Role } from '@/types/user/userEnum'

export default function CheckInvitationEmail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useAuth()
  const { id } = useParams()

  const [checkUserMatched, resultsCheckUserMatched] = useCheckUserMatchedMutation()
  const [checkRegisteringUser, resultsCheckRegisteringUser] = useCheckRegisteringUserMutation()

  useEffect(() => {
    if (id) {
      if (auth.role === Role.TALENT) {
        checkUserMatched({ key: id })
      }
      checkRegisteringUser({ key: id })
    }
  }, [id, checkUserMatched, checkRegisteringUser])

  const isAuthenticated = auth.isAuthenticated

  if (isAuthenticated) {
    if (auth.role === Role.TALENT) {
      switch (resultsCheckUserMatched.data?.isMatch) {
        case true:
          navigate('/dashboard')
          break
        case false:
          if (resultsCheckRegisteringUser.data?.isRegisteringUser) {
            dispatch(
              signOut({ type: 'auth/signOut', payload: `/public-access/invitation-move-on/${id}` }),
            )
          } else {
            dispatch(signOut()) && navigate('/sign-in')
          }
          break
        default:
          break
      }
    } else {
      switch (resultsCheckRegisteringUser.data?.isRegisteringUser) {
        case true:
          dispatch(
            signOut({ type: 'auth/signOut', payload: `/public-access/invitation-move-on/${id}` }),
          )
          break
        case false:
          dispatch(signOut()) && navigate('/sign-in')
          break
        default:
          break
      }
    }
  } else {
    switch (resultsCheckRegisteringUser.data?.isRegisteringUser) {
      case true:
        navigate(`/public-access/invitation-move-on/${id}`)
        break
      case false:
        navigate('/sign-in')
        break
      default:
        break
    }
  }

  return <PageLoader />
}
