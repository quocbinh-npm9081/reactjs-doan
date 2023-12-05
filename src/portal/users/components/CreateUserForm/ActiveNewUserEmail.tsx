import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { PageLoader } from '@/routes/PageLoader/PageLoader'
import { signOut } from '@/store/auth/authSlice'
import { useConfirmRegisterMutation } from '@/store/user/userApi'
import { MESSAGE_ACTIVE_USER_INVALID_KEY } from '@/types/auth/constants'
import { EmessageResponse, IDataResponse } from '@/types/auth/forgotPassword/forgotPasswordResponse'

export default function ActiveNewUserEmail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const [activeAccount, { isSuccess, error, isError }] = useConfirmRegisterMutation()
  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null

  const customMessages: { [key in EmessageResponse]?: string } = {
    [EmessageResponse.userInvalidKey]: MESSAGE_ACTIVE_USER_INVALID_KEY,
  }
  const messageErr = errorCode ? customMessages[errorCode] : ''

  useEffect(() => {
    if (id) activeAccount({ key: id })
  }, [id, activeAccount, navigate])

  useEffect(() => {
    if (isSuccess) {
      toast.success('Active successfully !')
      dispatch(signOut())
      navigate('/sign-in')
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      toast.error(messageErr)
      dispatch(signOut())
      navigate('/sign-in')
    }
  }, [isError])

  return <PageLoader />
}
