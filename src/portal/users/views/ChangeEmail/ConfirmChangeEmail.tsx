import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link as ReactRouterLink } from 'react-router-dom'

import { signOut } from '@/store/auth/authSlice'
import { useRequestChangeEmailMutation } from '@/store/profile/profileApi'

export default function ConfirmChangeEmail() {
  const [changeEmail, { isSuccess }] = useRequestChangeEmailMutation()
  const dispatch = useDispatch()
  const handleClickConfirmEmail = () => {
    changeEmail()
  }
  useEffect(() => {
    if (isSuccess)
      dispatch(
        signOut({
          payload: '/email-confirmation',
          type: 'auth/signOut',
        }),
      )
  }, [isSuccess])

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex!important',
        justifyContent: 'center',
        alignItems: 'center',
      }}
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
        <Typography component="h1" variant="h5">
          Change email?
        </Typography>
        <Typography variant="subtitle2" color="gray" sx={{ my: 2 }}>
          Are you sure to request an email change? If yes, Please click confirm
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleClickConfirmEmail}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            component={ReactRouterLink}
            to="/profile"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
