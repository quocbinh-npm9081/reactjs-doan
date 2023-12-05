import { Alert, AlertTitle, AppBar, Box, Dialog, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'

export default function EmailConfirmationPageActive() {
  const [open, setOpen] = useState(true)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      (
      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar></Toolbar>
        </AppBar>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: '100%',
          }}
        >
          <Alert severity="info" sx={{ marginTop: '50px', maxWidth: '800px' }}>
            <AlertTitle>Email Confirmation !</AlertTitle>
            <Box color="grey">
              You have successfully updated your email, we have sent an email to your new email to
              confirm its validity. Once you receive the email, click the link to activate your
              account
              <strong>check it out!</strong>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                my={2}
              >
                <Box display="inline" to="/sign-in" component={ReactRouterLink}>
                  <Typography gutterBottom variant="body2" display="block" color="#1976d2">
                    Back to sign in
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Alert>
        </Box>
      </Dialog>
      )
    </>
  )
}
