import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { PageLoader } from '@/routes/PageLoader/PageLoader'
import { useFinshChangeEmailMutation } from '@/store/profile/profileApi'
import { MESSAGE_USER_INVALID_KEY } from '@/types/auth/constants'
import { EmessageResponse, IDataResponse } from '@/types/auth/forgotPassword/forgotPasswordResponse'

const ActiveNewEmail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [activeEmail, { isSuccess, isError, error }] = useFinshChangeEmailMutation()
  const navigate = useNavigate()
  const customMessages: { [key in EmessageResponse]?: string } = {
    [EmessageResponse.userInvalidKey]: MESSAGE_USER_INVALID_KEY,
  }
  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null
  const messageErr = errorCode ? customMessages[errorCode] : ''

  useEffect(() => {
    if (id) activeEmail({ key: id })
  }, [id, activeEmail])

  useEffect(() => {
    if (isSuccess) {
      toast.success('Change email successfully')
      navigate('/sign-in')
    }
  }, [isSuccess, dispatch, navigate])
  useEffect(() => {
    if (isError) {
      toast.error(messageErr)
      navigate('/sign-in')
    }
  }, [isError])
  return <PageLoader />
}

export default ActiveNewEmail
