import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import AppRouting from './AppRouting'
import { localToken } from './constant/constant'
import { useRefreshTokenMutation } from './store/auth/authApi'
import { useAuth } from './store/auth/useAuth'

export default function App() {
  const [refreshToken, { isError }] = useRefreshTokenMutation()
  const auth = useAuth()
  const refreshTokenVal = auth?.refreshToken ? auth?.refreshToken : ''
  const navigate = useNavigate()

  useEffect(() => {
    if (refreshTokenVal != '') {
      const interval = setInterval(
        () => {
          refreshToken({ refreshToken: refreshTokenVal })
        },
        13 * 60 * 1000,
      )
      return () => clearInterval(interval)
    }
  }, [refreshTokenVal, refreshToken])

  useEffect(() => {
    if (isError) {
      localStorage.removeItem(localToken)
      navigate('sign-in')
    }
  }, [isError, navigate])

  return (
    <>
      <AppRouting />
      <ToastContainer
        position={'top-right'}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        closeButton={false}
      />
    </>
  )
}
