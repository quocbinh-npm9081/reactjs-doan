import { Alert, Box, Container, LinearProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import ResetPasswordForm from '@/auth/components/ResetPasswordForm/ResetPasswordForm'
import { useResetPasswordMutation } from '@/store/auth/authApi'
import {
  MESSAGE_RESET_PASSWORD_SUCCESS,
  MESSAGE_USER_INVALID_KEY,
  MESSAGE_USER_IS_NOT_ACTIVE,
  MESSAGE_USER_IS_UNVERIFIED,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_USERNAME_PASSWORD_INCORRECT,
} from '@/types/auth/constants'
import { EmessageResponse, IDataResponse } from '@/types/auth/forgotPassword/forgotPasswordResponse'

const ResetPasswordPage = () => {
  const navigation = useNavigate()
  const [resetPassword, { error, isSuccess, isError, isLoading }] = useResetPasswordMutation()

  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse
  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.userIsUnverified]: MESSAGE_USER_IS_UNVERIFIED,
    [EmessageResponse.userInvalidKey]: MESSAGE_USER_INVALID_KEY,
    [EmessageResponse.userNotFound]: MESSAGE_USER_NOT_FOUND,
    [EmessageResponse.userNameOrPasswordInCorrect]: MESSAGE_USERNAME_PASSWORD_INCORRECT,
    [EmessageResponse.userIsNotActive]: MESSAGE_USER_IS_NOT_ACTIVE,
  }
  const messageErr = errorCode ? customMessages[errorCode] : ''
  const onSubmit = (dataRequest: { password: string; key: string }) => {
    resetPassword(dataRequest)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(MESSAGE_RESET_PASSWORD_SUCCESS)
      navigation('/')
    }
  }, [isSuccess, navigation])

  return (
    <>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ display: 'flex!important', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" my={2}>
            Reset your password?
          </Typography>
          <Typography variant="subtitle2" color="gray" mb={4}>
            Enter your new pasword
          </Typography>
          {isError && (
            <Alert severity="error" className="my-3 w-full">
              {messageErr}{' '}
              {errorCode === EmessageResponse.userInvalidKey && (
                <Box sx={{ display: 'inline-block' }}>
                  <Link to="/auth/forgot-password">
                    <Typography variant="body2" sx={{ textDecoration: 'undeline' }}>
                      Here
                    </Typography>
                  </Link>
                </Box>
              )}
            </Alert>
          )}
          <ResetPasswordForm isLoading={isLoading} isError={isError} onSubmit={onSubmit} />
          {isLoading && <LinearProgress className="line-progressbar" />}
        </Box>
      </Container>
    </>
  )
}

export default ResetPasswordPage
