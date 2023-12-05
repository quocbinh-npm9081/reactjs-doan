import { Box, Container, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import ChangeEmailForm from '@/portal/components/ChangeEmailForm/ChangeEmailForm'
import { signOut } from '@/store/auth/authSlice'
import { useChangeEmailMutation } from '@/store/profile/profileApi'

export interface Values {
  id: string
  email: string
}
export default function ChangeEmailPage() {
  const [changeEmail, { isLoading, isError, error, isSuccess }] = useChangeEmailMutation()
  const navigate = useNavigate()
  const dispath = useDispatch()
  const onSubmit = (values: Values) => {
    changeEmail({ key: values.id, email: values.email })
  }
  useEffect(() => {
    if (isSuccess) {
      dispath(signOut())
      navigate('/auth/email-confirmation/active')
    }
  }, [navigate, isSuccess, dispath])
  return (
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
          background: 'white',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mt: 4 }}>
          Change email?
        </Typography>
        <Typography variant="subtitle2" color="gray" sx={{ my: 2 }}>
          Enter your new email and we will send you a link to reset your email
        </Typography>

        <ChangeEmailForm
          isLoading={isLoading}
          isError={isError}
          error={error}
          onSubmit={onSubmit}
        />
      </Box>
    </Container>
  )
}
