import { Email } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import { EMAIL_INVALID, EMAIL_REQUIRED, REGEX_VALID_EMAIL } from '@/types/auth/constants'

export type ForgotPaswordFormProps = {
  isLoading?: boolean
  onSubmit: (value: Values) => void
}

interface Values {
  email: string
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email(EMAIL_INVALID)
    .required(EMAIL_REQUIRED)
    .matches(REGEX_VALID_EMAIL, EMAIL_INVALID),
})

const ForgotPasswordForm: React.FC<ForgotPaswordFormProps> = ({ isLoading, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values) => {
      onSubmit({ email: values.email })
    },
  })

  return (
    <Box noValidate component="form" width="100%" autoComplete="off" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        required
        margin="normal"
        type="email"
        id="email"
        label="Email"
        className="w-full h-16 mt-4"
        size="small"
        value={formik.values.email}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={
          formik.touched.email && Boolean(formik.errors.email) && (formik.errors.email ?? '')
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        }}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />

      <Stack spacing={3} direction="column">
        <Button
          variant="contained"
          color="primary"
          className=""
          type="submit"
          disabled={isLoading || !formik.isValid || !formik.dirty}
        >
          {isLoading ? <CircularProgress color="inherit" size="1.5rem" /> : 'Confirm'}
        </Button>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Link to="/sign-in">
            <Typography gutterBottom variant="body2" display="block">
              Back to sign in
            </Typography>
          </Link>
        </Box>
      </Stack>
    </Box>
  )
}

export default ForgotPasswordForm
