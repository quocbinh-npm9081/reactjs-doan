import { Alert, AlertTitle, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function EmailConfirmationPage() {
  return (
    <>
      <Alert severity="info" sx={{ marginTop: '50px', maxWidth: '800px', margin: '50px auto' }}>
        <AlertTitle>Email Confirmation !</AlertTitle>
        <Box color="grey">
          We have sent an email to to confirm its validity. Once you receive the email, click on the
          link provided to go to the next step — <strong>check it out!</strong>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} my={2}>
          <Link
            to="/sign-in"
            className="text-xs text-primary w-fit decoration-green no-underline hover:underline"
          >
            <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
              Back to sign in
            </Typography>
          </Link>
        </Box>
      </Alert>
    </>
  )
}
