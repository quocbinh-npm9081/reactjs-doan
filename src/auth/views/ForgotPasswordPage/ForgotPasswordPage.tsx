import { Alert, AlertTitle, Box, Container, LinearProgress, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import ForgotPasswordForm from '@/auth/components/ForgotPasswordForm/ForgotPasswordForm'
import { useForgotPasswordMutation } from '@/store/auth/authApi'
import {
  MESSAGE_USER_INVALID_KEY,
  MESSAGE_USER_IS_NOT_ACTIVE,
  MESSAGE_USER_IS_UNVERIFIED,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_USERNAME_PASSWORD_INCORRECT,
} from '@/types/auth/constants'
import { EmessageResponse, IDataResponse } from '@/types/auth/forgotPassword/forgotPasswordResponse'

const ForgotPasswordPage = () => {
  const [forgotPassword, { error, isSuccess, isError, isLoading }] = useForgotPasswordMutation()

  const onSubmit = (dataRequest: { email: string }) => {
    forgotPassword(dataRequest)
  }

  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null

  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.userIsUnverified]: MESSAGE_USER_IS_UNVERIFIED,
    [EmessageResponse.userInvalidKey]: MESSAGE_USER_INVALID_KEY,
    [EmessageResponse.userNotFound]: MESSAGE_USER_NOT_FOUND,
    [EmessageResponse.userNameOrPasswordInCorrect]: MESSAGE_USERNAME_PASSWORD_INCORRECT,
    [EmessageResponse.userIsNotActive]: MESSAGE_USER_IS_NOT_ACTIVE,
  }

  const messageErr = errorCode ? customMessages[errorCode] : ''

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ display: 'flex!important', justifyContent: 'center', alignItems: 'center' }}
    >
      {isSuccess ? (
        <Alert severity="info" sx={{ marginTop: '50px' }}>
          <AlertTitle>Email Confirmation !</AlertTitle>
          <Box color="grey">
            We have sent an email to your email to confirm its validity. Once you receive the email,
            click on the link provided to go to the next step — <strong>check it out!</strong>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              my={2}
            >
              <Link
                to="/sign-in"
                className="text-xs text-primary w-fit decoration-green no-underline hover:underline"
              >
                <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                  Back to sign in
                </Typography>
              </Link>
            </Box>
          </Box>
        </Alert>
      ) : (
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
          <Typography component="h1" variant="h5" sx={{ mt: 4 }}>
            Forgot your password?
          </Typography>
          <Typography variant="subtitle2" color="gray" sx={{ my: 2 }}>
            Enter your email and we will send you a link to reset your password
          </Typography>
          {isError && (
            <Alert severity="error" className="my-3 w-full">
              {messageErr}
            </Alert>
          )}
          <ForgotPasswordForm isLoading={isLoading} onSubmit={onSubmit} />
          {isLoading && <LinearProgress className="line-progressbar" />}
        </Box>
      )}
    </Container>
  )
}

export default ForgotPasswordPage
