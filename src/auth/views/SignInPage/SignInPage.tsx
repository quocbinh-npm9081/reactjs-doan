import { Alert, Box, Container, LinearProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import SigninForm from '@/auth/components/SignInForm/SignInForm'
import { useSigninMutation } from '@/store/auth/authApi'
import {
  MESSAGE_USER_INVALID_KEY,
  MESSAGE_USER_IS_NOT_ACTIVE,
  MESSAGE_USER_IS_UNVERIFIED,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_USERNAME_PASSWORD_INCORRECT,
} from '@/types/auth/constants'
import { EmessageResponse, IDataResponse } from '@/types/auth/forgotPassword/forgotPasswordResponse'
import { LoginRequest } from '@/types/auth/login/loginRequest'

export default function SignInPage() {
  const [signin, { isLoading, error, isSuccess, isError }] = useSigninMutation()
  const onSubmit = (dataRequest: LoginRequest) => {
    signin(dataRequest)
  }

  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null

  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.userIsUnverified]: MESSAGE_USER_IS_UNVERIFIED,
    [EmessageResponse.userIsNotActive]: MESSAGE_USER_IS_NOT_ACTIVE,
    [EmessageResponse.userInvalidKey]: MESSAGE_USER_INVALID_KEY,
    [EmessageResponse.userNotFound]: MESSAGE_USER_NOT_FOUND,
    [EmessageResponse.userNameOrPasswordInCorrect]: MESSAGE_USERNAME_PASSWORD_INCORRECT,
  }

  const messageErr = errorCode ? customMessages[errorCode] : ''

  useEffect(() => {
    if (isSuccess) {
      toast.success('Login succcessfully')
    }
  }, [isSuccess])
  return (
    <Container component="main" maxWidth="sm">
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
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {isError && (
          <Alert
            severity="error"
            className="mb-2"
            sx={{ width: '100%!important', marginTop: '10px', marginBottom: '10px' }}
          >
            {messageErr}
          </Alert>
        )}
        {isLoading && <LinearProgress className="line-progressbar" />}
        <SigninForm isLoading={isLoading} onSubmit={onSubmit} />
      </Box>
    </Container>
  )
}
