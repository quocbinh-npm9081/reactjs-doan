import { Box, Container, Typography } from '@mui/material'

import ChangePasswordForm from '@/portal/components/ChangePasswordForm/ChangePasswordForm'

export default function ChangePassword() {
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
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'white',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Change password
        </Typography>
        <ChangePasswordForm />
      </Box>
    </Container>
  )
}
